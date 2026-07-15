package com.pgmadeeazy.controller;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pgmadeeazy.model.Property;
import com.pgmadeeazy.service.PropertyService;
import com.pgmadeeazy.service.exceptions.ImageDeleteException;
import com.pgmadeeazy.service.exceptions.ImageUploadException;
import com.pgmadeeazy.service.exceptions.PropertyNotFoundException;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PropertyController {
    
    private static final Logger logger = LoggerFactory.getLogger(PropertyController.class);
    
    @Autowired
    private PropertyService propertyService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Property> createProperty(
            @RequestPart("property") String propertyStr,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            logger.info("Received property creation request");
            logger.debug("Property data: {}", propertyStr);
            
            if (images != null) {
                logger.info("Received {} images", images.size());
                for (MultipartFile image : images) {
                    logger.debug("Image details - Name: {}, Size: {}, Content Type: {}", 
                        image.getOriginalFilename(), 
                        image.getSize(), 
                        image.getContentType());
                }
            }

            Property property = objectMapper.readValue(propertyStr, Property.class);
            logger.debug("Parsed property object: {}", property);
            
            // Validate required fields
            if (property.getName() == null || property.getName().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Property name is required");
            }
            if (property.getCity() == null || property.getCity().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "City is required");
            }
            if (property.getRent() == null || property.getRent() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid rent amount is required");
            }
            if (property.getOwnerName() == null || property.getOwnerName().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Owner name is required");
            }
            if (property.getOwnerPhone() == null || property.getOwnerPhone().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Owner phone is required");
            }
            
            Property createdProperty = propertyService.createProperty(property, images);
            logger.info("Property created successfully with ID: {}", createdProperty.getId());
            
            return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
        } catch (IOException e) {
            logger.error("Failed to parse property data", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to parse property data: " + e.getMessage());
        } catch (ImageUploadException e) {
            logger.error("Failed to upload images", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload images: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Failed to create property", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create property: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Property> updateProperty(
            @PathVariable String id,
            @RequestPart("property") String propertyStr,
            @RequestPart(value = "images", required = false) List<MultipartFile> images)
            throws IOException, ImageUploadException, ImageDeleteException, PropertyNotFoundException {
        try {
            Property property = objectMapper.readValue(propertyStr, Property.class);
            Property updatedProperty = propertyService.updateProperty(id, property, images);
            return ResponseEntity.ok(updatedProperty);
        } catch (PropertyNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to parse property data", e);
        } catch (ImageUploadException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload images", e);
        } catch (ImageDeleteException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete images", e);
        }
    }

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        List<Property> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable String id) {
        try {
            Property property = propertyService.getPropertyById(id);
            return ResponseEntity.ok(property);
        } catch (PropertyNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable String id) {
        try {
            propertyService.deleteProperty(id);
            return ResponseEntity.noContent().build();
        } catch (PropertyNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Property>> getPendingProperties() {
        try {
            logger.info("Fetching pending properties");
            List<Property> properties = propertyService.getPendingProperties();
            logger.info("Found {} pending properties", properties.size());
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            logger.error("Error fetching pending properties", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch pending properties");
        }
    }

    @GetMapping("/approved")
    public ResponseEntity<List<Property>> getApprovedProperties() {
        List<Property> properties = propertyService.getApprovedProperties();
        return ResponseEntity.ok(properties);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Property> approveProperty(
            @PathVariable String id,
            @RequestPart("approvalNote") String approvalNote) {
        try {
            Property approvedProperty = propertyService.approveProperty(id, "Admin", approvalNote);
            return ResponseEntity.ok(approvedProperty);
        } catch (PropertyNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Property> rejectProperty(
            @PathVariable String id,
            @RequestPart("rejectionReason") String rejectionReason) {
        try {
            Property rejectedProperty = propertyService.rejectProperty(id, rejectionReason);
            return ResponseEntity.ok(rejectedProperty);
        } catch (PropertyNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/owner/{ownerName}")
    public ResponseEntity<List<Property>> getPropertiesByOwner(@PathVariable String ownerName) {
        List<Property> properties = propertyService.getPropertiesByOwner(ownerName);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/owner/email/{ownerEmail}")
    public ResponseEntity<List<Property>> getPropertiesByOwnerEmail(@PathVariable String ownerEmail) {
        List<Property> properties = propertyService.getPropertiesByOwnerEmail(ownerEmail);
        return ResponseEntity.ok(properties);
    }
}