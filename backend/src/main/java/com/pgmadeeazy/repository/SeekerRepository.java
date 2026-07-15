package com.pgmadeeazy.repository;

import com.pgmadeeazy.model.Seeker;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeekerRepository extends MongoRepository<Seeker, String> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Seeker findByEmail(String email);
}