package com.pgmadeeazy.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.pgmadeeazy.model.ApprovalStatus;
import com.pgmadeeazy.model.Property;

@Repository
public interface PropertyRepository extends MongoRepository<Property, String> {
    List<Property> findByApprovalStatus(ApprovalStatus status);
    List<Property> findByCityAndAreaAndBuildingTypeAndRentBetween(String city, String area, String buildingType, Double minRent, Double maxRent);
    List<Property> findByCityAndAreaAndRentBetweenAndRoomsBetweenAndBuildingTypeAndCategory(String city, String area, Double minRent, Double maxRent, Integer minRooms, Integer maxRooms, String buildingType, String category);
    List<Property> findByOwnerName(String ownerName);
    List<Property> findByOwnerEmail(String ownerEmail);
    List<Property> findByOwnerId(String ownerId);
}
