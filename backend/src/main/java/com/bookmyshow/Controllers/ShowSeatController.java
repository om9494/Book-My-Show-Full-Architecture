package com.bookmyshow.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bookmyshow.Exceptions.SeatAlreadyLockedException;
import com.bookmyshow.Exceptions.ShowSeatDoesNotExists;
import com.bookmyshow.Models.ShowSeat;
import com.bookmyshow.Services.ShowSeatService;

// DTO to capture the JSON payload from React
class ShowSeatRequest {
    private int seatId;
    private String userId;

    public int getSeatId() { return seatId; }
    public void setSeatId(int seatId) { this.seatId = seatId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}

@RestController
@RequestMapping("/seats")
public class ShowSeatController {

    @Autowired
    private ShowSeatService showSeatService;

    @GetMapping("/all")
    public List<ShowSeat> getAllShowSeats() {
        return showSeatService.getAllShowSeats();
    }

    @GetMapping("/id/{id}")
    public ShowSeat getShowSeatById(@PathVariable int id) {
        try {
            return showSeatService.getShowSeatById(id);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/show/{showId}/available")
    public List<ShowSeat> getAvailableSeatsByShowId(@PathVariable int showId) {
        try {
            return showSeatService.getAvailableSeatsByShowId(showId);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/show/{showId}/booked")
    public List<ShowSeat> getBookedSeatsByShowId(@PathVariable int showId) {
        try {
            return showSeatService.getBookedSeatsByShowId(showId);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/show/{showId}")
    public List<ShowSeat> getShowSeatsByShowId(@PathVariable int showId) {
        try {
            return showSeatService.getShowSeatsByShowId(showId);
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping("/lockSeat")
    public ResponseEntity<?> lockSeat(@RequestBody ShowSeatRequest request) {
        try {
            ShowSeat lockedSeat = showSeatService.lockSeat(request.getSeatId(), request.getUserId());
            return ResponseEntity.ok(lockedSeat);
        } catch (ShowSeatDoesNotExists e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seat not found");
        } catch (SeatAlreadyLockedException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/unlockSeat")
    public ResponseEntity<?> unlockSeat(@RequestBody ShowSeatRequest request) {
        try {
            ShowSeat unlockedSeat = showSeatService.unlockSeat(request.getSeatId(), request.getUserId());
            return ResponseEntity.ok(unlockedSeat);
        } catch (ShowSeatDoesNotExists e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seat not found");
        }
    }
}