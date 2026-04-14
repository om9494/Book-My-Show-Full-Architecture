package com.bookmyshow.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {

    @GetMapping("/")
    public ResponseEntity<String> healthCheck() {
        // The ALB requires a 200 OK status at the root path to mark the EC2 instance as healthy.
        return new ResponseEntity<>("BookMyShow API is healthy and running!", HttpStatus.OK);
    }
}