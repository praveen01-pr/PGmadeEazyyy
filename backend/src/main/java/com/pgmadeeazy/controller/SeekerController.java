package com.pgmadeeazy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgmadeeazy.model.Seeker;
import com.pgmadeeazy.repository.SeekerRepository;
import com.pgmadeeazy.repository.PropertyRepository;

@RestController
@RequestMapping("/api/seekers")
public class SeekerController {

    @Autowired
    private SeekerRepository seekerRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @PutMapping(value = "/{id}/profile", consumes = "application/json")
    public ResponseEntity<?> updateSeekerProfile(@PathVariable String id, @RequestBody SeekerProfileDTO profileDTO) {
        return seekerRepository.findById(id)
                .map(seeker -> {
                    // Update seeker profile with new information
                    seeker.setFullName(profileDTO.getFullName());
                    seeker.setEmail(profileDTO.getEmail());
                    seeker.setPhone(profileDTO.getPhone());
                    seeker.setRole(profileDTO.getRole());
                    seeker.setDateOfBirth(profileDTO.getDateOfBirth());
                    seeker.setGender(profileDTO.getGender());
                    seeker.setCurrentCity(profileDTO.getCurrentCity());
                    seeker.setGovtIdType(profileDTO.getGovtIdType());
                    seeker.setGovtIdNumber(profileDTO.getGovtIdNumber());
                    seeker.setEmergencyContactName(profileDTO.getEmergencyContactName());
                    seeker.setEmergencyContactNumber(profileDTO.getEmergencyContactNumber());
                    seeker.setPreferredLocation(profileDTO.getPreferredLocation());
                    seeker.setOccupationType(profileDTO.getOccupationType());
                    seeker.setCollegeName(profileDTO.getCollegeName());
                    seeker.setCourseName(profileDTO.getCourseName());
                    seeker.setYearOfStudy(profileDTO.getYearOfStudy());
                    seeker.setCollegeAddress(profileDTO.getCollegeAddress());
                    seeker.setStudentId(profileDTO.getStudentId());
                    seeker.setCompanyName(profileDTO.getCompanyName());
                    seeker.setJobRole(profileDTO.getJobRole());
                    seeker.setWorkExperience(profileDTO.getWorkExperience());
                    seeker.setOfficeAddress(profileDTO.getOfficeAddress());
                    seeker.setWorkId(profileDTO.getWorkId());
                    seeker.setUserType(profileDTO.getUserType());

                    Seeker updatedSeeker = seekerRepository.save(seeker);
                    return ResponseEntity.ok(new SeekerProfileDTO(
                        updatedSeeker.getId(),
                        updatedSeeker.getFullName(),
                        updatedSeeker.getEmail(),
                        updatedSeeker.getPhone(),
                        updatedSeeker.getRole(),
                        updatedSeeker.getDateOfBirth(),
                        updatedSeeker.getGender(),
                        updatedSeeker.getCurrentCity(),
                        updatedSeeker.getGovtIdType(),
                        updatedSeeker.getGovtIdNumber(),
                        updatedSeeker.getEmergencyContactName(),
                        updatedSeeker.getEmergencyContactNumber(),
                        updatedSeeker.getPreferredLocation(),
                        updatedSeeker.getOccupationType(),
                        updatedSeeker.getCollegeName(),
                        updatedSeeker.getCourseName(),
                        updatedSeeker.getYearOfStudy(),
                        updatedSeeker.getCollegeAddress(),
                        updatedSeeker.getStudentId(),
                        updatedSeeker.getCompanyName(),
                        updatedSeeker.getJobRole(),
                        updatedSeeker.getWorkExperience(),
                        updatedSeeker.getOfficeAddress(),
                        updatedSeeker.getWorkId(),
                        updatedSeeker.getUserType()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<?> getSeekerProfile(@PathVariable String id) {
        return seekerRepository.findById(id)
                .map(seeker -> {
                    // Create a DTO with all seeker information
                    return ResponseEntity.ok(new SeekerProfileDTO(
                        seeker.getId(),
                        seeker.getFullName(),
                        seeker.getEmail(),
                        seeker.getPhone(),
                        seeker.getRole(),
                        seeker.getDateOfBirth(),
                        seeker.getGender(),
                        seeker.getCurrentCity(),
                        seeker.getGovtIdType(),
                        seeker.getGovtIdNumber(),
                        seeker.getEmergencyContactName(),
                        seeker.getEmergencyContactNumber(),
                        seeker.getPreferredLocation(),
                        seeker.getOccupationType(),
                        seeker.getCollegeName(),
                        seeker.getCourseName(),
                        seeker.getYearOfStudy(),
                        seeker.getCollegeAddress(),
                        seeker.getStudentId(),
                        seeker.getCompanyName(),
                        seeker.getJobRole(),
                        seeker.getWorkExperience(),
                        seeker.getOfficeAddress(),
                        seeker.getWorkId(),
                        seeker.getUserType()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/favorites/{propertyId}")
    public ResponseEntity<?> toggleFavorite(@PathVariable String id, @PathVariable String propertyId) {
        return seekerRepository.findById(id)
                .map(seeker -> {
                    java.util.List<String> favorites = seeker.getSavedProperties();
                    boolean isFavorite;
                    if (favorites.contains(propertyId)) {
                        favorites.remove(propertyId);
                        isFavorite = false;
                    } else {
                        favorites.add(propertyId);
                        isFavorite = true;
                    }
                    seeker.setSavedProperties(favorites);
                    seekerRepository.save(seeker);
                    java.util.Map<String, Object> response = new java.util.HashMap<>();
                    response.put("isFavorite", isFavorite);
                    response.put("savedProperties", favorites);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/favorites")
    public ResponseEntity<?> getFavorites(@PathVariable String id) {
        return seekerRepository.findById(id)
                .map(seeker -> {
                    java.util.List<String> favoriteIds = seeker.getSavedProperties();
                    return ResponseEntity.ok(propertyRepository.findAllById(favoriteIds));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

class SeekerProfileDTO {
    private String id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String dateOfBirth;
    private String gender;
    private String currentCity;
    private String govtIdType;
    private String govtIdNumber;
    private String emergencyContactName;
    private String emergencyContactNumber;
    private String preferredLocation;
    private String occupationType;
    private String collegeName;
    private String courseName;
    private String yearOfStudy;
    private String collegeAddress;
    private String studentId;
    private String companyName;
    private String jobRole;
    private String workExperience;
    private String officeAddress;
    private String workId;
    private String userType;

    public SeekerProfileDTO(String id, String fullName, String email, String phone, String role,
                           String dateOfBirth, String gender, String currentCity, String govtIdType,
                           String govtIdNumber, String emergencyContactName, String emergencyContactNumber,
                           String preferredLocation, String occupationType, String collegeName,
                           String courseName, String yearOfStudy, String collegeAddress, String studentId,
                           String companyName, String jobRole, String workExperience, String officeAddress,
                           String workId, String userType) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.currentCity = currentCity;
        this.govtIdType = govtIdType;
        this.govtIdNumber = govtIdNumber;
        this.emergencyContactName = emergencyContactName;
        this.emergencyContactNumber = emergencyContactNumber;
        this.preferredLocation = preferredLocation;
        this.occupationType = occupationType;
        this.collegeName = collegeName;
        this.courseName = courseName;
        this.yearOfStudy = yearOfStudy;
        this.collegeAddress = collegeAddress;
        this.studentId = studentId;
        this.companyName = companyName;
        this.jobRole = jobRole;
        this.workExperience = workExperience;
        this.officeAddress = officeAddress;
        this.workId = workId;
        this.userType = userType;
    }

    // Getters
    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getRole() { return role; }
    public String getDateOfBirth() { return dateOfBirth; }
    public String getGender() { return gender; }
    public String getCurrentCity() { return currentCity; }
    public String getGovtIdType() { return govtIdType; }
    public String getGovtIdNumber() { return govtIdNumber; }
    public String getEmergencyContactName() { return emergencyContactName; }
    public String getEmergencyContactNumber() { return emergencyContactNumber; }
    public String getPreferredLocation() { return preferredLocation; }
    public String getOccupationType() { return occupationType; }
    public String getCollegeName() { return collegeName; }
    public String getCourseName() { return courseName; }
    public String getYearOfStudy() { return yearOfStudy; }
    public String getCollegeAddress() { return collegeAddress; }
    public String getStudentId() { return studentId; }
    public String getCompanyName() { return companyName; }
    public String getJobRole() { return jobRole; }
    public String getWorkExperience() { return workExperience; }
    public String getOfficeAddress() { return officeAddress; }
    public String getWorkId() { return workId; }
    public String getUserType() { return userType; }
}