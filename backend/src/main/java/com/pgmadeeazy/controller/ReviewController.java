package com.pgmadeeazy.controller;

import com.pgmadeeazy.model.Review;
import com.pgmadeeazy.repository.ReviewRepository;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/properties")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/{propertyId}/reviews")
    public ResponseEntity<List<Review>> getReviews(@PathVariable String propertyId) {
        return ResponseEntity.ok(reviewRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId));
    }

    @PostMapping("/{propertyId}/reviews")
    public ResponseEntity<Review> createReview(@PathVariable String propertyId, @RequestBody Review review) {
        review.setPropertyId(propertyId);
        review.setCreatedAt(new Date());
        if (review.getRating() == null || review.getRating() < 1) {
            review.setRating(5);
        }
        if (review.getComment() == null) {
            review.setComment("");
        }
        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }
}
