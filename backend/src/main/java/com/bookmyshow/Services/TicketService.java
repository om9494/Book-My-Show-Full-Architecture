package com.bookmyshow.Services;

import com.bookmyshow.Dtos.RequestDtos.EmailPayloadDto;
import com.bookmyshow.Dtos.RequestDtos.TicketEntryDto;
import com.bookmyshow.Dtos.RequestDtos.TicketUpdateDto;
import com.bookmyshow.Dtos.ResponseDtos.TicketResponseDto;
import com.bookmyshow.Exceptions.RequestedSeatAreNotAvailable;
import com.bookmyshow.Exceptions.ShowDoesNotExists;
import com.bookmyshow.Exceptions.TicketUpdateException;
import com.bookmyshow.Exceptions.UserDoesNotExist;
import com.bookmyshow.Models.*;
import com.bookmyshow.Repositories.*;

import io.awspring.cloud.sns.core.SnsTemplate;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class TicketService {

    @Autowired private TicketRepository ticketRepository;
    @Autowired private ShowRepository showRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ShowSeatRepository showSeatRepository;
    @Autowired private ShowFoodRepository showFoodRepository;
    @Autowired private StringRedisTemplate redisTemplate;

    // 🌟 INJECT SNS TEMPLATE FOR ASYNC MESSAGING
    @Autowired private SnsTemplate snsTemplate;
    @Value("${cloud.aws.sns.topic.arn}")
    private String snsTopicArn;

    public List<TicketResponseDto> getAllTicketsByUserId(Integer userId) throws UserDoesNotExist {
        userRepository.findById(userId).orElseThrow(UserDoesNotExist::new);
        List<Ticket> tickets = ticketRepository.findByUserId(userId);
        List<TicketResponseDto> dtos = new ArrayList<>();
        for (Ticket ticket : tickets) dtos.add(buildTicketResponseDto(ticket.getShow(), ticket));
        return dtos;
    }

    public List<TicketResponseDto> getActiveTicketsByUserId(Integer userId) throws UserDoesNotExist {
        userRepository.findById(userId).orElseThrow(UserDoesNotExist::new);
        java.sql.Date today = new java.sql.Date(System.currentTimeMillis());
        List<Ticket> tickets = ticketRepository.findActiveTicketsByUserId(userId, today);
        List<TicketResponseDto> dtos = new ArrayList<>();
        for (Ticket ticket : tickets) dtos.add(buildTicketResponseDto(ticket.getShow(), ticket));
        return dtos;
    }

    private TicketResponseDto buildTicketResponseDto(Show show, Ticket ticket) {
        return TicketResponseDto.builder()
                .ticketId(ticket.getTicketId())
                .bookedAt(ticket.getBookedAt())
                .showId(show.getShowId())
                .movie(show.getMovie())
                .theater(show.getTheatre())
                .seatId(ticket.getShowSeat().getId())
                .seatNo(ticket.getShowSeat().getSeatNo())
                .address(show.getTheatre().getAddress())
                .date(show.getDate())
                .time(show.getTime())
                .fare(ticket.getTicketPrice())
                .purchasedFoods(ticket.getPurchasedFoods())
                .build();
    }

    @Transactional
    public List<TicketResponseDto> ticketBooking(TicketEntryDto ticketEntryDto) throws Exception {
        Show show = showRepository.findById(ticketEntryDto.getShowId()).orElseThrow(ShowDoesNotExists::new);
        User user = userRepository.findById(ticketEntryDto.getUserId()).orElseThrow(UserDoesNotExist::new);

        List<String> requestedSeats = ticketEntryDto.getRequestSeats();
        if (requestedSeats == null || requestedSeats.isEmpty()) throw new RequestedSeatAreNotAvailable("No Seat Requested!");

        int totalFoodCost = 0;
        List<ShowFood> purchasedFoods = new ArrayList<>();
        if (ticketEntryDto.getRequestedFoodIds() != null && !ticketEntryDto.getRequestedFoodIds().isEmpty()) {
            for (Integer foodId : ticketEntryDto.getRequestedFoodIds()) {
                ShowFood food = showFoodRepository.findById(foodId).orElseThrow(() -> new Exception("Food item not found with ID: " + foodId));
                totalFoodCost += food.getPrice();
                purchasedFoods.add(food);
            }
        }

        List<TicketResponseDto> createdTicketsDto = new ArrayList<>();
        boolean isFirstTicket = true;

        for (String seatNo : requestedSeats) {
            List<ShowSeat> showSeatList = showSeatRepository.findByShowId(show.getShowId());
            ShowSeat bookedSeat = null;
            for (ShowSeat seat : showSeatList) {
                if (seat.getSeatNo().equals(seatNo)) {
                    if (!seat.getIsAvailable()) throw new RequestedSeatAreNotAvailable("Seat " + seatNo + " is already booked.");
                    bookedSeat = seat;
                    break;
                }
            }
            if (bookedSeat == null) throw new RequestedSeatAreNotAvailable("The requested seat " + seatNo + " does not exist.");

            bookedSeat.setIsAvailable(Boolean.FALSE);
            int currentTicketPrice = bookedSeat.getPrice();
            if (isFirstTicket) { currentTicketPrice += totalFoodCost; isFirstTicket = false; }

            Ticket ticket = new Ticket();
            ticket.setTicketPrice(currentTicketPrice);
            ticket.setShowSeat(bookedSeat);
            ticket.setUser(user);
            ticket.setShow(show);
            ticket.setPurchasedFoods(purchasedFoods);

            showSeatRepository.save(bookedSeat);
            Ticket savedTicket = ticketRepository.save(ticket);

            // Delete Redis Lock
            redisTemplate.delete(ShowSeatServiceImpl.REDIS_LOCK_PREFIX + bookedSeat.getId());
            createdTicketsDto.add(buildTicketResponseDto(show, savedTicket));
        }

        // 🌟 PUBLISH TO SNS INSTEAD OF SYNC EMAIL (Instant Response < 50ms)
        EmailPayloadDto payload = new EmailPayloadDto(user.getEmail(), user.getName(), createdTicketsDto);
        snsTemplate.convertAndSend(snsTopicArn, payload);

        return createdTicketsDto;
    }

    public static final int UPDATE_FEE = 20;
    public static final int MIN_HOURS_BEFORE_SHOW_FOR_UPDATE = 3;

    @Transactional
    public TicketResponseDto updateTicket(TicketUpdateDto dto) throws UserDoesNotExist, TicketUpdateException, ShowDoesNotExists, RequestedSeatAreNotAvailable {
        Ticket originalTicket = ticketRepository.findById(dto.getOriginalTicketId())
                .orElseThrow(() -> new TicketUpdateException("Ticket with ID " + dto.getOriginalTicketId() + " not found."));

        User user = userRepository.findById(dto.getUserId()).orElseThrow(UserDoesNotExist::new);
        if (!originalTicket.getUser().getId().equals(user.getId())) throw new TicketUpdateException("Access Denied");

        Show oldShow = originalTicket.getShow();
        ShowSeat oldSeat = originalTicket.getShowSeat();

        validateTimeWindow(oldShow);

        Show newShow = showRepository.findById(dto.getNewShowId()).orElseThrow(ShowDoesNotExists::new);
        ShowSeat newSeat = findAndValidateNewSeat(newShow, dto.getNewSeatNo());

        oldSeat.setIsAvailable(Boolean.TRUE);
        showSeatRepository.save(oldSeat);

        newSeat.setIsAvailable(Boolean.FALSE);
        showSeatRepository.save(newSeat);
        redisTemplate.delete(ShowSeatServiceImpl.REDIS_LOCK_PREFIX + newSeat.getId());

        originalTicket.setShow(newShow);
        originalTicket.setShowSeat(newSeat);
        originalTicket.setTicketPrice(newSeat.getPrice() + UPDATE_FEE);

        Ticket updatedTicket = ticketRepository.save(originalTicket);
        TicketResponseDto ticketResponseDto = buildTicketResponseDto(newShow, updatedTicket);

        // 🌟 PUBLISH TO SNS INSTEAD OF SYNC EMAIL
        EmailPayloadDto payload = new EmailPayloadDto(user.getEmail(), user.getName(), List.of(ticketResponseDto));
        snsTemplate.convertAndSend(snsTopicArn, payload);

        return ticketResponseDto;
    }

    private ShowSeat findAndValidateNewSeat(Show show, String seatNo) throws RequestedSeatAreNotAvailable {
        List<ShowSeat> showSeats = showSeatRepository.findByShowId(show.getShowId());
        for (ShowSeat seat : showSeats) {
            if (seat.getSeatNo().equals(seatNo)) {
                if (!seat.getIsAvailable()) throw new RequestedSeatAreNotAvailable("The requested seat " + seatNo + " is already booked.");
                return seat;
            }
        }
        throw new RequestedSeatAreNotAvailable("The requested seat " + seatNo + " does not exist for this show.");
    }

    private void validateTimeWindow(Show show) throws TicketUpdateException {
        Date showDateTime = combineDateAndTime(show.getDate(), show.getTime());
        long hoursDifference = TimeUnit.MILLISECONDS.toHours(showDateTime.getTime() - new Date().getTime());
        if (hoursDifference < MIN_HOURS_BEFORE_SHOW_FOR_UPDATE) throw new TicketUpdateException("Updates allowed up to " + MIN_HOURS_BEFORE_SHOW_FOR_UPDATE + " hours before show.");
    }

    private Date combineDateAndTime(java.sql.Date date, Time time) {
        Calendar dateCal = Calendar.getInstance(); dateCal.setTime(date);
        Calendar timeCal = Calendar.getInstance(); timeCal.setTime(time);
        dateCal.set(Calendar.HOUR_OF_DAY, timeCal.get(Calendar.HOUR_OF_DAY));
        dateCal.set(Calendar.MINUTE, timeCal.get(Calendar.MINUTE));
        dateCal.set(Calendar.SECOND, timeCal.get(Calendar.SECOND));
        dateCal.set(Calendar.MILLISECOND, 0);
        return dateCal.getTime();
    }
}