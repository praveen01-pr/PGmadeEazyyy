package com.pgmadeeazy.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pgmadeeazy.model.Booking;
import com.pgmadeeazy.model.Payment;
import com.pgmadeeazy.model.Property;
import com.pgmadeeazy.model.Seeker;
import com.pgmadeeazy.repository.BookingRepository;
import com.pgmadeeazy.repository.PaymentRepository;
import com.pgmadeeazy.repository.PropertyRepository;
import com.pgmadeeazy.repository.SeekerRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private SeekerRepository seekerRepository;

    public Booking createBooking(Booking booking) {
        // Validate room availability
        validateRoomAvailability(booking);

        booking.setCreatedAt(new Date());
        booking.setUpdatedAt(new Date());
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setPaymentStatus(Booking.PaymentStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public int getAvailableRooms(String propertyId, Date checkInDate, Date checkOutDate) {
        // Get the property
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found"));

        // Get all bookings for this property that overlap with the requested dates
        List<Booking> overlappingBookings = bookingRepository.findByPropertyId(propertyId)
            .stream()
            .filter(existingBooking -> {
                Date existingStart = existingBooking.getCheckInDate();
                Date existingEnd = existingBooking.getCheckOutDate();

                // Only consider bookings that overlap with the requested dates
                // A booking overlaps if:
                // 1. The new booking's start date falls within an existing booking's date range
                // 2. The new booking's end date falls within an existing booking's date range
                // 3. The new booking completely encompasses an existing booking's date range
                return (checkInDate.before(existingEnd) && checkInDate.after(existingStart)) || // Case 1
                       (checkOutDate.before(existingEnd) && checkOutDate.after(existingStart)) || // Case 2
                       (checkInDate.before(existingStart) && checkOutDate.after(existingEnd));    // Case 3
            })
            .collect(Collectors.toList());

        // Calculate total rooms booked for these dates
        int roomsBooked = overlappingBookings.stream()
            .mapToInt(existingBooking -> existingBooking.getRoomsToBook() != null ? existingBooking.getRoomsToBook() : 1)
            .sum();

        // Calculate available rooms
        return Math.max(0, property.getRooms() - roomsBooked);
    }

    private void validateRoomAvailability(Booking booking) {
        // Get the property
        Property property = propertyRepository.findById(booking.getPropertyId())
            .orElseThrow(() -> new RuntimeException("Property not found"));

        // Get all bookings for this property that overlap with the requested dates
        List<Booking> overlappingBookings = bookingRepository.findByPropertyId(booking.getPropertyId())
            .stream()
            .filter(existingBooking -> {
                Date existingStart = existingBooking.getCheckInDate();
                Date existingEnd = existingBooking.getCheckOutDate();
                Date newStart = booking.getCheckInDate();
                Date newEnd = booking.getCheckOutDate();

                // Only consider bookings that overlap with the requested dates
                // A booking overlaps if:
                // 1. The new booking's start date falls within an existing booking's date range
                // 2. The new booking's end date falls within an existing booking's date range
                // 3. The new booking completely encompasses an existing booking's date range
                return (newStart.before(existingEnd) && newStart.after(existingStart)) || // Case 1
                       (newEnd.before(existingEnd) && newEnd.after(existingStart)) ||     // Case 2
                       (newStart.before(existingStart) && newEnd.after(existingEnd));     // Case 3
            })
            .collect(Collectors.toList());

        // Calculate total rooms booked for these dates
        int roomsBooked = overlappingBookings.stream()
            .mapToInt(existingBooking -> existingBooking.getRoomsToBook() != null ? existingBooking.getRoomsToBook() : 1)
            .sum();

        // Check if there are enough rooms available
        int roomsToBook = booking.getRoomsToBook() != null ? booking.getRoomsToBook() : 1;
        if (roomsBooked + roomsToBook > property.getRooms()) {
            throw new RuntimeException("Not enough rooms available for the selected dates");
        }
    }

    public Booking updateBookingStatus(String bookingId, Booking.BookingStatus status) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            // Update the status
            booking.setStatus(status);
            
            // Update payment status based on booking status and payment method
            if (status == Booking.BookingStatus.CONFIRMED) {
                if (booking.getPaymentMethod() == Booking.PaymentMethod.PAYPAL) {
                    booking.setPaymentStatus(Booking.PaymentStatus.PAID);
                } else if (booking.getPaymentMethod() == Booking.PaymentMethod.CASH) {
                    booking.setPaymentStatus(Booking.PaymentStatus.PENDING);
                }
            }
            
            // Update the timestamp
            booking.setUpdatedAt(new Date());
            
            // Save the updated booking
            return bookingRepository.save(booking);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update booking status: " + e.getMessage());
        }
    }

    public Booking updatePaymentStatus(String bookingId, Booking.PaymentStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setPaymentStatus(status);
        booking.setUpdatedAt(new Date());
        return bookingRepository.save(booking);
    }

    public List<Booking> getSeekerBookings(String seekerId) {
        List<Booking> bookings = bookingRepository.findBySeekerId(seekerId);
        return bookings.stream()
            .map(booking -> {
                // Set property details
                Property property = propertyRepository.findById(booking.getPropertyId())
                    .orElse(null);
                if (property != null) {
                    booking.setProperty(property);
                }
                
                // Set seeker details
                Seeker seeker = seekerRepository.findById(booking.getSeekerId())
                    .orElseThrow(() -> new RuntimeException("Seeker not found for ID: " + booking.getSeekerId()));
                booking.setSeeker(seeker);
                
                return booking;
            })
            .collect(Collectors.toList());
    }

    public List<Booking> getPropertyBookings(String propertyId) {
        return bookingRepository.findByPropertyId(propertyId);
    }

    public Booking getBookingById(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Set property details
        Property property = propertyRepository.findById(booking.getPropertyId())
            .orElse(null);
        if (property != null) {
            booking.setProperty(property);
        }
        
        // Set seeker details
        Seeker seeker = seekerRepository.findById(booking.getSeekerId())
            .orElse(null);
        if (seeker != null) {
            booking.setSeeker(seeker);
        }
        
        return booking;
    }

    public Payment createPayment(Payment payment) {
        payment.setCreatedAt(new Date());
        payment.setUpdatedAt(new Date());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        return paymentRepository.save(payment);
    }

    public Payment updatePaymentStatus(String paymentId, Payment.PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(status);
        payment.setUpdatedAt(new Date());
        return paymentRepository.save(payment);
    }

    public List<Payment> getBookingPayments(String bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    public List<Payment> getSeekerPayments(String seekerId) {
        return paymentRepository.findByPayerId(seekerId);
    }

    public List<Booking> getProviderBookings(String providerId) {
        // Get all properties owned by the provider
        List<Property> providerProperties = propertyRepository.findByOwnerId(providerId);
        
        // Get all bookings for these properties
        List<Booking> providerBookings = providerProperties.stream()
            .flatMap(property -> bookingRepository.findByPropertyId(property.getId()).stream())
            .collect(Collectors.toList());

        // Populate property and seeker details for each booking
        return providerBookings.stream()
            .map(booking -> {
                // Set property details
                Property property = propertyRepository.findById(booking.getPropertyId())
                    .orElse(null);
                if (property != null) {
                    booking.setProperty(property);
                }

                // Set seeker details
                Seeker seeker = seekerRepository.findById(booking.getSeekerId())
                    .orElseThrow(() -> new RuntimeException("Seeker not found for ID: " + booking.getSeekerId()));
                booking.setSeeker(seeker);

                return booking;
            })
            .collect(Collectors.toList());
    }
}