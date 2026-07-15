package com.pgmadeeazy.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.pgmadeeazy.model.Booking;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findBySeekerId(String seekerId);
    List<Booking> findByPropertyId(String propertyId);
    List<Booking> findBySeekerIdAndStatus(String seekerId, Booking.BookingStatus status);
    List<Booking> findByPropertyIdAndStatus(String propertyId, Booking.BookingStatus status);
} 