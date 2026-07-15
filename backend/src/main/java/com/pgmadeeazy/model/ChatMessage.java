package com.pgmadeeazy.model;

import java.util.Date;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;

@Data
@Document(collection = "chat_messages")
public class ChatMessage {
    @Id
    private String id;

    @Field
    private String propertyId;

    @Field
    private String propertyName;

    @Field
    private String seekerId;

    @Field
    private String seekerName;

    @Field
    private String providerId;

    @Field
    private String providerName;

    @Field
    private String senderId;

    @Field
    private String senderName;

    @Field
    private String senderRole;

    @Field
    private String message;

    @Field
    private Date timestamp;
}
