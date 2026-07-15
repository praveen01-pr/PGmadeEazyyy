package com.pgmadeeazy.repository;

import com.pgmadeeazy.model.Review;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByPropertyIdOrderByCreatedAtDesc(String propertyId);
}
