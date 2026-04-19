package com.bookmyshow.Services;

import com.bookmyshow.Dtos.RequestDtos.EmailPayloadDto;
import io.awspring.cloud.sqs.annotation.SqsListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailSqsListener {

    @Autowired
    private EmailService emailService;

    // Listens continuously to the SQS queue defined in application.properties
    @SqsListener("${cloud.aws.sqs.queue.name}")
    public void processEmailMessage(EmailPayloadDto payload) {
        System.out.println("SQS Message Received: Sending email to " + payload.getUserEmail());

        emailService.sendTicketConfirmationEmail(
                payload.getUserEmail(),
                payload.getUserName(),
                payload.getTickets()
        );
    }
}