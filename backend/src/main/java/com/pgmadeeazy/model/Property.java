package com.pgmadeeazy.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "properties")
public class Property {
    @Id
    private String id;

    @Field
    private String name;

    @Field
    private String description;

    @Field
    private String city;

    @Field
    private String area;

    @Field
    private Double rent;

    @Field
    private Integer rooms;

    @Field
    private List<String> roomTypes;

    @Field
    private Double areaInSqft;

    @Field
    private Integer floor;

    @Field
    private Integer totalFloors;

    @Field
    private Integer buildingAge;

    @Field
    private String buildingType;

    @Field
    private Double deposit;

    @Field
    private Double maintenance;

    @Field
    private Double electricity;

    @Field
    private Double water;

    @Field
    private Double internet;

    @Field
    private Double otherCharges;

    @Field
    private Integer minStay;

    @Field
    private Integer maxStay;

    @Field
    private List<String> amenities;

    @Field
    private List<String> rules;

    @Field
    private String ownerId;

    @Field
    private String ownerName;

    @Field
    private String ownerPhone;

    @Field
    private String ownerEmail;

    @Field
    private String preferredContactTime;

    @Field
    private List<String> images;

    @Field
    private Date createdAt;

    @Field
    private Date updatedAt;

    @Field
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Field
    private String approvedBy;

    @Field
    private Date approvedAt;

    @Field
    private String approvalNote;

    @Field
    private String rejectionReason;

    @Field
    private String locationDetails;

    @Field
    private String category;

    public boolean isApproved() {
        return approvalStatus == ApprovalStatus.APPROVED;
    }

    public boolean isPending() {
        return approvalStatus == ApprovalStatus.PENDING;
    }

    public boolean isRejected() {
        return approvalStatus == ApprovalStatus.REJECTED;
    }
}
