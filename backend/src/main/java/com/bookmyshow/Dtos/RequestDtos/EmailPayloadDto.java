package com.bookmyshow.Dtos.RequestDtos;

import com.bookmyshow.Dtos.ResponseDtos.TicketResponseDto;
import java.util.List;

public class EmailPayloadDto {
    private String userEmail;
    private String userName;
    private List<TicketResponseDto> tickets;

    // Default constructor for JSON deserialization
    public EmailPayloadDto() {}

    public EmailPayloadDto(String userEmail, String userName, List<TicketResponseDto> tickets) {
        this.userEmail = userEmail;
        this.userName = userName;
        this.tickets = tickets;
    }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public List<TicketResponseDto> getTickets() { return tickets; }
    public void setTickets(List<TicketResponseDto> tickets) { this.tickets = tickets; }
}