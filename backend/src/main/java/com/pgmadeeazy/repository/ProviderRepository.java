package com.pgmadeeazy.repository;

import com.pgmadeeazy.model.Provider;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProviderRepository extends MongoRepository<Provider, String> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    Provider findByEmail(String email);
}