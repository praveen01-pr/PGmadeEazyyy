package com.pgmadeeazy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pgmadeeazy.service.EmailService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @Autowired
    private EmailService emailService;

    @Value("${spring.mail.username}")
    private String configuredEmail;

    @GetMapping("/email")
    public ResponseEntity<String> testEmail(@RequestParam String email) {
        try {
            logger.info("Testing email functionality to: {}", email);
            emailService.sendRegistrationEmail(
                email,  // Using the provided email address
                "Test User",
                "seeker"
            );
            return ResponseEntity.ok("Test email sent successfully to: " + email);
        } catch (Exception e) {
            logger.error("Test email failed: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to send test email: " + e.getMessage() + "\n" + 
                      "Please check the server logs for more details");
        }
    }
} 