package com.pgmadeeazy.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgmadeeazy.model.Property;
import com.pgmadeeazy.model.Provider;
import com.pgmadeeazy.model.Seeker;
import com.pgmadeeazy.repository.AdminRepository;
import com.pgmadeeazy.repository.ProviderRepository;
import com.pgmadeeazy.repository.SeekerRepository;
import com.pgmadeeazy.service.PropertyService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private SeekerRepository seekerRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        try {
            logger.info("Fetching admin statistics");
            Map<String, Object> stats = new HashMap<>();
            
            // Property statistics
            try {
                List<Property> allProperties = propertyService.getAllProperties();
                List<Property> pendingProperties = propertyService.getPendingProperties();
                List<Property> approvedProperties = propertyService.getApprovedProperties();
                List<Property> rejectedProperties = propertyService.getRejectedProperties();

                logger.debug("Found {} total properties", allProperties.size());
                logger.debug("Found {} pending properties", pendingProperties.size());
                logger.debug("Found {} approved properties", approvedProperties.size());
                logger.debug("Found {} rejected properties", rejectedProperties.size());

                stats.put("totalProperties", allProperties.size());
                stats.put("pendingProperties", pendingProperties.size());
                stats.put("approvedProperties", approvedProperties.size());
                stats.put("rejectedProperties", rejectedProperties.size());
                logger.debug("Property statistics fetched successfully");
            } catch (Exception e) {
                logger.error("Error fetching property statistics", e);
                stats.put("totalProperties", 0);
                stats.put("pendingProperties", 0);
                stats.put("approvedProperties", 0);
                stats.put("rejectedProperties", 0);
            }
            
            // User statistics
            try {
                stats.put("totalAdmins", adminRepository.findAll().size());
                stats.put("totalProviders", providerRepository.findAll().size());
                stats.put("totalSeekers", seekerRepository.findAll().size());
                logger.debug("User statistics fetched successfully");
            } catch (Exception e) {
                logger.error("Error fetching user statistics", e);
                stats.put("totalAdmins", 0);
                stats.put("totalProviders", 0);
                stats.put("totalSeekers", 0);
            }
            
            logger.info("Admin statistics fetched successfully");
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error in getAdminStats", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch admin statistics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/properties/pending")
    public ResponseEntity<?> getPendingProperties() {
        try {
            logger.info("Fetching pending properties");
            var properties = propertyService.getPendingProperties();
            Map<String, Object> response = new HashMap<>();
            response.put("properties", properties);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching pending properties", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch pending properties");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/properties/rejected")
    public ResponseEntity<List<Property>> getRejectedProperties() {
        try {
            List<Property> rejectedProperties = propertyService.getRejectedProperties();
            return ResponseEntity.ok(rejectedProperties);
        } catch (Exception e) {
            logger.error("Error fetching rejected properties", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/providers")
    public ResponseEntity<List<Provider>> getAllProviders() {
        try {
            logger.info("Fetching all providers");
            List<Provider> providers = providerRepository.findAll();
            return ResponseEntity.ok(providers);
        } catch (Exception e) {
            logger.error("Error fetching providers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/seekers")
    public ResponseEntity<List<Seeker>> getAllSeekers() {
        try {
            logger.info("Fetching all seekers");
            List<Seeker> seekers = seekerRepository.findAll();
            return ResponseEntity.ok(seekers);
        } catch (Exception e) {
            logger.error("Error fetching seekers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 