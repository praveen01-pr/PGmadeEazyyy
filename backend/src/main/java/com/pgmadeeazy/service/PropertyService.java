package com.pgmadeeazy.service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pgmadeeazy.model.ApprovalStatus;
import com.pgmadeeazy.model.Property;
import com.pgmadeeazy.repository.PropertyRepository;
import com.pgmadeeazy.service.exceptions.ImageDeleteException;
import com.pgmadeeazy.service.exceptions.ImageUploadException;
import com.pgmadeeazy.service.exceptions.PropertyNotFoundException;
import com.pgmadeeazy.utils.CloudinaryUtils;

@Service
public class PropertyService {
    
    private final PropertyRepository propertyRepository;
    private final CloudinaryUtils cloudinaryUtils;
    @Value("${property.maxImages:5}")
    private int maxImages;
    private static final Logger logger = LoggerFactory.getLogger(PropertyService.class);

    @Autowired
    public PropertyService(PropertyRepository propertyRepository, CloudinaryUtils cloudinaryUtils) {
        this.propertyRepository = propertyRepository;
        this.cloudinaryUtils = cloudinaryUtils;
    }

    public Property createProperty(Property property, List<MultipartFile> images) throws IOException, ImageUploadException {
        // Set default values
        property.setApprovalStatus(ApprovalStatus.PENDING);
        property.setCreatedAt(new Date());
        property.setUpdatedAt(new Date());

        // Validate and handle image uploads
        if (images != null && !images.isEmpty()) {
            if (images.size() > maxImages) {
                throw new ImageUploadException("Maximum number of images exceeded. Maximum allowed: " + maxImages);
            }
            List<String> newImageUrls = cloudinaryUtils.uploadImages(images);
            property.setImages(newImageUrls);
        }

        // Validate required fields
        validateProperty(property);

        return propertyRepository.save(property);
    }

    private void validateProperty(Property property) {
        if (property.getName() == null || property.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Property name is required");
        }
        if (property.getCity() == null || property.getCity().trim().isEmpty()) {
            throw new IllegalArgumentException("City is required");
        }
        if (property.getRent() == null || property.getRent() <= 0) {
            throw new IllegalArgumentException("Valid rent amount is required");
        }
        if (property.getOwnerName() == null || property.getOwnerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Owner name is required");
        }
        if (property.getOwnerPhone() == null || property.getOwnerPhone().trim().isEmpty()) {
            throw new IllegalArgumentException("Owner phone is required");
        }
    }

    public Property approveProperty(String id, String adminName, String approvalNote) {
        Property property = propertyRepository.findById(id)
            .orElseThrow(() -> new PropertyNotFoundException("Property not found with ID: " + id));

        if (property.getApprovalStatus() != ApprovalStatus.PENDING) {
            throw new IllegalArgumentException("Property is not in pending state");
        }

        property.setApprovalStatus(ApprovalStatus.APPROVED);
        property.setApprovedBy(adminName);
        property.setApprovalNote(approvalNote);
        property.setApprovedAt(new Date());
        property.setUpdatedAt(new Date());

        return propertyRepository.save(property);
    }

    public Property rejectProperty(String id, String rejectionReason) {
        Property property = propertyRepository.findById(id)
            .orElseThrow(() -> new PropertyNotFoundException("Property not found with ID: " + id));

        if (property.getApprovalStatus() != ApprovalStatus.PENDING) {
            throw new IllegalArgumentException("Property is not in pending state");
        }

        property.setApprovalStatus(ApprovalStatus.REJECTED);
        property.setRejectionReason(rejectionReason);
        property.setUpdatedAt(new Date());

        return propertyRepository.save(property);
    }

    public List<Property> getPendingProperties() {
        try {
            logger.info("Service: Fetching pending properties");
            List<Property> properties = propertyRepository.findByApprovalStatus(ApprovalStatus.PENDING);
            logger.info("Service: Found {} pending properties", properties.size());
            return properties;
        } catch (Exception e) {
            logger.error("Service: Error fetching pending properties", e);
            throw e;
        }
    }

    public List<Property> getApprovedProperties() {
        return propertyRepository.findByApprovalStatus(ApprovalStatus.APPROVED);
    }

    public List<Property> getRejectedProperties() {
        return propertyRepository.findByApprovalStatus(ApprovalStatus.REJECTED);
    }

    public Property updateProperty(String id, Property property, List<MultipartFile> images) throws IOException, ImageUploadException, ImageDeleteException {
        Property existingProperty = propertyRepository.findById(id)
            .orElseThrow(() -> new PropertyNotFoundException("Property not found with ID: " + id));

        // Update basic property details
        existingProperty.setName(property.getName());
        existingProperty.setDescription(property.getDescription());
        existingProperty.setCity(property.getCity());
        existingProperty.setArea(property.getArea());
        existingProperty.setRent(property.getRent());
        existingProperty.setRooms(property.getRooms());
        existingProperty.setRoomTypes(property.getRoomTypes());
        existingProperty.setAreaInSqft(property.getAreaInSqft());
        existingProperty.setFloor(property.getFloor());
        existingProperty.setTotalFloors(property.getTotalFloors());
        existingProperty.setBuildingAge(property.getBuildingAge());
        existingProperty.setBuildingType(property.getBuildingType());
        existingProperty.setDeposit(property.getDeposit());
        existingProperty.setMaintenance(property.getMaintenance());
        existingProperty.setElectricity(property.getElectricity());
        existingProperty.setWater(property.getWater());
        existingProperty.setInternet(property.getInternet());
        existingProperty.setOtherCharges(property.getOtherCharges());
        existingProperty.setMinStay(property.getMinStay());
        existingProperty.setMaxStay(property.getMaxStay());
        existingProperty.setAmenities(property.getAmenities());
        existingProperty.setRules(property.getRules());
        existingProperty.setOwnerName(property.getOwnerName());
        existingProperty.setOwnerPhone(property.getOwnerPhone());
        existingProperty.setOwnerEmail(property.getOwnerEmail());
        existingProperty.setPreferredContactTime(property.getPreferredContactTime());
        existingProperty.setUpdatedAt(new Date());

        // Handle image updates
        List<String> existingImages = existingProperty.getImages();
        List<String> newImages = property.getImages();

        // Delete removed images
        if (existingImages != null && newImages != null) {
            List<String> removedImages = existingImages.stream()
                .filter(img -> !newImages.contains(img))
                .collect(Collectors.toList());

            for (String removedImage : removedImages) {
                cloudinaryUtils.deleteImageByUrl(removedImage);
            }
        }

        // Upload new images
        if (images != null && !images.isEmpty()) {
            if (images.size() > maxImages) {
                throw new ImageUploadException("Maximum number of images exceeded. Maximum allowed: " + maxImages);
            }
            List<String> uploadedImages = cloudinaryUtils.uploadImages(images);
            existingProperty.setImages(uploadedImages);
        }

        // Validate updated property
        validateProperty(existingProperty);

        return propertyRepository.save(existingProperty);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Property getPropertyById(String id) {
        return propertyRepository.findById(id)
            .orElseThrow(() -> new PropertyNotFoundException("Property not found with ID: " + id));
    }

    public void deleteProperty(String id) {
        Property property = propertyRepository.findById(id)
            .orElseThrow(() -> new PropertyNotFoundException("Property not found with ID: " + id));

        // Delete associated images
        if (property.getImages() != null) {
            for (String imageUrl : property.getImages()) {
                cloudinaryUtils.deleteImageByUrl(imageUrl);
            }
        }

        propertyRepository.delete(property);
    }

    public List<Property> getPropertiesByOwnerName(String ownerName) {
        return propertyRepository.findByOwnerName(ownerName);
    }

    public List<Property> searchProperties(String city, String area, String buildingType, Double minRent, Double maxRent) {
        return propertyRepository.findByCityAndAreaAndBuildingTypeAndRentBetween(
            city, area, buildingType, minRent, maxRent);
    }

    public List<Property> getProperties(String city, String area, Double minRent, Double maxRent, Integer minRooms, Integer maxRooms, String buildingType, String category) {
        return propertyRepository.findByCityAndAreaAndRentBetweenAndRoomsBetweenAndBuildingTypeAndCategory(city, area, minRent, maxRent, minRooms, maxRooms, buildingType, category);
    }

    public void uploadImages(String propertyId, MultipartFile[] files) throws IOException, ImageUploadException {
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new PropertyNotFoundException("Property not found with ID: " + propertyId));

        if (files != null && files.length > 0) {
            if (files.length > maxImages) {
                throw new ImageUploadException("Maximum number of images exceeded. Maximum allowed: " + maxImages);
            }
            List<String> newImageUrls = cloudinaryUtils.uploadImages(java.util.Arrays.asList(files));
            property.setImages(newImageUrls);
            property.setUpdatedAt(new Date());
            propertyRepository.save(property);
        }
    }

    public void deleteImages(String propertyId) {
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new PropertyNotFoundException("Property not found with ID: " + propertyId));

        if (property.getImages() != null) {
            for (String imageUrl : property.getImages()) {
                cloudinaryUtils.deleteImageByUrl(imageUrl);
            }
            property.setImages(null);
            property.setUpdatedAt(new Date());
            propertyRepository.save(property);
        }
    }

    public void updateLocationDetails(String propertyId, String locationDetails) {
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new PropertyNotFoundException("Property not found with ID: " + propertyId));

        property.setLocationDetails(locationDetails);
        property.setUpdatedAt(new Date());
        propertyRepository.save(property);
    }

    public List<Property> getPropertiesByOwner(String ownerName) {
        return propertyRepository.findByOwnerName(ownerName);
    }

    public List<Property> getPropertiesByOwnerEmail(String ownerEmail) {
        return propertyRepository.findByOwnerEmail(ownerEmail);
    }
}
