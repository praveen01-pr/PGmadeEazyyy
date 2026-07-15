package com.pgmadeeazy.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pgmadeeazy.service.PayPalService;

@RestController
@RequestMapping("/api/bookings/payments")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PayPalController {

    private static final Logger logger = LoggerFactory.getLogger(PayPalController.class);

    @Autowired
    private PayPalService payPalService;

    @PostMapping("/paypal")
    public ResponseEntity<?> createPayPalPayment(@RequestBody Map<String, Object> request) {
        try {
            logger.info("Received PayPal payment request: {}", request);
            
            // Validate required fields
            if (!request.containsKey("amount") || request.get("amount") == null) {
                return ResponseEntity.badRequest().body("Amount is required");
            }
            if (!request.containsKey("currency") || request.get("currency") == null) {
                return ResponseEntity.badRequest().body("Currency is required");
            }
            if (!request.containsKey("description") || request.get("description") == null) {
                return ResponseEntity.badRequest().body("Description is required");
            }
            if (!request.containsKey("returnUrl") || request.get("returnUrl") == null) {
                return ResponseEntity.badRequest().body("Return URL is required");
            }
            if (!request.containsKey("cancelUrl") || request.get("cancelUrl") == null) {
                return ResponseEntity.badRequest().body("Cancel URL is required");
            }

            // Parse and validate amount
            Double amount;
            try {
                amount = Double.parseDouble(request.get("amount").toString());
                if (amount <= 0) {
                    return ResponseEntity.badRequest().body("Amount must be greater than 0");
                }
            } catch (NumberFormatException e) {
                logger.error("Invalid amount format: {}", request.get("amount"));
                return ResponseEntity.badRequest().body("Invalid amount format");
            }

            String currency = request.get("currency").toString();
            String description = request.get("description").toString();
            String returnUrl = request.get("returnUrl").toString();
            String cancelUrl = request.get("cancelUrl").toString();
            String bookingId = request.containsKey("bookingId") ? request.get("bookingId").toString() : null;

            logger.debug("Creating PayPal payment with validated parameters: amount={}, currency={}, description={}, returnUrl={}, cancelUrl={}, bookingId={}",
                    amount, currency, description, returnUrl, cancelUrl, bookingId);

            Map<String, String> payment = payPalService.createPayment(
                bookingId,
                amount,
                currency,
                description,
                returnUrl,
                cancelUrl
            );

            logger.info("PayPal payment created successfully with ID: {}", payment.get("paymentId"));
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid request parameters: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating PayPal payment: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error creating PayPal payment: " + e.getMessage());
        }
    }

    @GetMapping("/paypal/success")
    public ResponseEntity<?> executePayPalPayment(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId) {
        try {
            if (paymentId == null || paymentId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Payment ID is required");
            }
            if (payerId == null || payerId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Payer ID is required");
            }

            logger.info("Executing PayPal payment with paymentId={}, payerId={}", paymentId, payerId);
            Map<String, Object> payment = payPalService.executePayment(paymentId, payerId);
            logger.info("PayPal payment executed successfully");
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            logger.error("Error executing PayPal payment: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error executing PayPal payment: " + e.getMessage());
        }
    }
} 