package com.pgmadeeazy.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.pgmadeeazy.model.Payment;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByBookingId(String bookingId);
    List<Payment> findByPayerId(String payerId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
} 