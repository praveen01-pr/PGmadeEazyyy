package com.pgmadeeazy.repository;

import com.pgmadeeazy.model.ChatMessage;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findBySeekerIdAndProviderIdAndPropertyIdOrderByTimestampAsc(
        String seekerId, String providerId, String propertyId
    );
    
    List<ChatMessage> findBySeekerIdOrderByTimestampDesc(String seekerId);
    
    List<ChatMessage> findByProviderIdOrderByTimestampDesc(String providerId);
}
