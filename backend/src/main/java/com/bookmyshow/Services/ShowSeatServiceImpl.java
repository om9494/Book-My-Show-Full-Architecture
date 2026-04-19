package com.bookmyshow.Services;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.StringRedisTemplate;

import com.bookmyshow.Exceptions.SeatAlreadyLockedException;
import com.bookmyshow.Exceptions.ShowDoesNotExists;
import com.bookmyshow.Exceptions.ShowSeatDoesNotExists;
import com.bookmyshow.Models.ShowSeat;
import com.bookmyshow.Repositories.ShowRepository;
import com.bookmyshow.Repositories.ShowSeatRepository;

@Service
public class ShowSeatServiceImpl implements ShowSeatService {

    @Autowired
    private ShowSeatRepository showSeatRepository;

    @Autowired
    private ShowRepository showRepository;

    // Inject Redis for 1-millisecond temporary locks
    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final long LOCK_TIMEOUT_MINUTES = 5;
    public static final String REDIS_LOCK_PREFIX = "seat:lock:"; // Public so TicketService can use it

    @Override
    public List<ShowSeat> getAllShowSeats() {
        return showSeatRepository.findAll();
    }

    @Override
    public ShowSeat getShowSeatById(int id) throws ShowSeatDoesNotExists {
        ShowSeat seat = showSeatRepository.findById(id).orElseThrow(ShowSeatDoesNotExists::new);
        applyRedisLockStatus(seat);
        return seat;
    }

    /**
     * Helper: Stitches the temporary Redis lock state into the RDS entity before sending to React.
     */
    private void applyRedisLockStatus(ShowSeat seat) {
        if (seat.getIsAvailable()) {
            String redisKey = REDIS_LOCK_PREFIX + seat.getId();
            String lockedBy = redisTemplate.opsForValue().get(redisKey);
            seat.setLockedByUserId(lockedBy);
        }
    }

    @Override
    public List<ShowSeat> getAvailableSeatsByShowId(int showId) throws ShowDoesNotExists {
        showRepository.findById(showId).orElseThrow(ShowDoesNotExists::new);
        List<ShowSeat> seats = showSeatRepository.findAvailableSeatsByShowId(showId);
        seats.forEach(this::applyRedisLockStatus);
        return seats;
    }

    @Override
    public List<ShowSeat> getBookedSeatsByShowId(int showId) throws ShowDoesNotExists {
        showRepository.findById(showId).orElseThrow(ShowDoesNotExists::new);
        return showSeatRepository.findBookedSeatsByShowId(showId);
    }

    @Override
    public List<ShowSeat> getShowSeatsByShowId(int showId) throws ShowDoesNotExists {
        showRepository.findById(showId).orElseThrow(ShowDoesNotExists::new);
        List<ShowSeat> seats = showSeatRepository.findByShowId(showId);
        seats.forEach(this::applyRedisLockStatus);
        return seats;
    }

    @Override
    @Transactional
    public ShowSeat lockSeat(int seatId, String userId) throws ShowSeatDoesNotExists, SeatAlreadyLockedException {
        ShowSeat showSeat = showSeatRepository.findById(seatId).orElseThrow(ShowSeatDoesNotExists::new);

        // 1. Check if the seat is already permanently paid for in RDS
        if (!showSeat.getIsAvailable()) {
            throw new SeatAlreadyLockedException("This seat is permanently booked.");
        }

        String redisKey = REDIS_LOCK_PREFIX + seatId;

        // 2. Check ElastiCache for an existing temporary lock
        String existingLockUser = redisTemplate.opsForValue().get(redisKey);
        if (existingLockUser != null && !existingLockUser.equals(userId)) {
            throw new SeatAlreadyLockedException("Seat held by another user. Try again in 5 mins.");
        }

        // 3. Set the lock in Redis with a strict TTL.
        redisTemplate.opsForValue().set(redisKey, userId, LOCK_TIMEOUT_MINUTES, TimeUnit.MINUTES);

        // Update memory state for frontend response (DO NOT save to RDS)
        showSeat.setLockedByUserId(userId);

        return showSeat;
    }

    @Override
    @Transactional
    public ShowSeat unlockSeat(int seatId, String userId) throws ShowSeatDoesNotExists {
        ShowSeat showSeat = showSeatRepository.findById(seatId).orElseThrow(ShowSeatDoesNotExists::new);

        String redisKey = REDIS_LOCK_PREFIX + seatId;
        String existingLockUser = redisTemplate.opsForValue().get(redisKey);

        // Only delete the Redis lock if the user requesting the unlock owns it
        if (userId.equals(existingLockUser)) {
            redisTemplate.delete(redisKey);
            showSeat.setLockedByUserId(null);
        } else if (existingLockUser != null) {
            showSeat.setLockedByUserId(existingLockUser);
        }

        return showSeat;
    }
}