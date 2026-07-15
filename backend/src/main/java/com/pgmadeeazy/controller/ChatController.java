package com.pgmadeeazy.controller;

import com.pgmadeeazy.model.ChatMessage;
import com.pgmadeeazy.repository.ChatMessageRepository;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        message.setTimestamp(new Date());
        ChatMessage saved = chatMessageRepository.save(message);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getHistory(
            @RequestParam String seekerId,
            @RequestParam String providerId,
            @RequestParam String propertyId) {
        return ResponseEntity.ok(chatMessageRepository
                .findBySeekerIdAndProviderIdAndPropertyIdOrderByTimestampAsc(seekerId, providerId, propertyId));
    }

    @GetMapping("/inbox/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getInbox(
            @PathVariable String userId,
            @RequestParam String role) {
        
        List<ChatMessage> messages;
        if ("seeker".equalsIgnoreCase(role)) {
            messages = chatMessageRepository.findBySeekerIdOrderByTimestampDesc(userId);
        } else {
            messages = chatMessageRepository.findByProviderIdOrderByTimestampDesc(userId);
        }

        // Group by thread key (seekerId + "_" + providerId + "_" + propertyId)
        Map<String, ChatMessage> uniqueThreads = new LinkedHashMap<>();
        for (ChatMessage msg : messages) {
            String threadKey = msg.getSeekerId() + "_" + msg.getProviderId() + "_" + msg.getPropertyId();
            if (!uniqueThreads.containsKey(threadKey)) {
                uniqueThreads.put(threadKey, msg);
            }
        }

        List<Map<String, Object>> inbox = new ArrayList<>();
        for (ChatMessage msg : uniqueThreads.values()) {
            Map<String, Object> thread = new HashMap<>();
            thread.put("propertyId", msg.getPropertyId());
            thread.put("propertyName", msg.getPropertyName());
            thread.put("seekerId", msg.getSeekerId());
            thread.put("seekerName", msg.getSeekerName());
            thread.put("providerId", msg.getProviderId());
            thread.put("providerName", msg.getProviderName());
            thread.put("lastMessage", msg.getMessage());
            thread.put("timestamp", msg.getTimestamp());
            
            if ("seeker".equalsIgnoreCase(role)) {
                thread.put("otherUserId", msg.getProviderId());
                thread.put("otherUserName", msg.getProviderName());
            } else {
                thread.put("otherUserId", msg.getSeekerId());
                thread.put("otherUserName", msg.getSeekerName());
            }
            inbox.add(thread);
        }

        return ResponseEntity.ok(inbox);
    }
}
