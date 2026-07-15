package com.pgmadeeazy.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;

    @Field
    private String bookingId;

    @Field
    private Double amount;

    @Field
    private PaymentMethod paymentMethod;

    @Field
    private PaymentStatus status;

    @Field
    private String transactionId; // PayPal transaction ID or cash receipt number

    @Field
    private Date paymentDate;

    @Field
    private String payerId; // Seeker's ID

    @Field
    private String payerEmail;

    @Field
    private String payerName;

    @Field
    private String notes;

    @Field
    private Date createdAt;

    @Field
    private Date updatedAt;

    // Nested enum for payment method
    public enum PaymentMethod {
        CASH,
        PAYPAL
    }

    // Nested enum for payment status
    public enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED,
        REFUNDED
    }
} 