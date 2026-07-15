package com.pgmadeeazy.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;

    @Field
    private String propertyId;

    @Field
    private Property property;

    @Field
    private String seekerId;

    @Field
    private Seeker seeker;

    @Field
    private Date checkInDate;

    @Field
    private Date checkOutDate;

    @Field
    private Integer numberOfGuests;

    @Field
    private Integer roomsToBook; // Number of rooms being booked

    @Field
    private Double totalAmount;

    @Field
    private BookingStatus status;

    @Field
    private PaymentStatus paymentStatus;

    @Field
    private PaymentMethod paymentMethod;

    @Field
    private String paymentId; // Reference to payments collection

    @Field
    private Date createdAt;

    @Field
    private Date updatedAt;

    @Field
    private String notes;

    @Field
    private String email; // Seeker's email

    // Nested enum for booking status
    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        CANCELLED,
        COMPLETED
    }

    // Nested enum for payment status
    public enum PaymentStatus {
        PENDING,
        PAID,
        FAILED,
        REFUNDED
    }

    // Nested enum for payment method
    public enum PaymentMethod {
        CASH,
        PAYPAL
    }
}