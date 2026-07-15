package com.pgmadeeazy.model;

import java.util.Date;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;

@Data
@Document(collection = "reviews")
public class Review {
    @Id
    private String id;

    @Field
    private String propertyId;

    @Field
    private String seekerId;

    @Field
    private String seekerName;

    @Field
    private Integer rating;

    @Field
    private String comment;

    @Field
    private Date createdAt;
}
