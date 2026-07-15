package com.pgmadeeazy.service;

import com.pgmadeeazy.dto.ProviderProfileDTO;
import com.pgmadeeazy.model.Provider;
import com.pgmadeeazy.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import jakarta.validation.Valid;
import java.util.List;

@Service
@Validated
public class ProviderService {

    @Autowired
    private ProviderRepository providerRepository;

    public ProviderProfileDTO getProviderProfile(String providerId) {
        Provider provider = providerRepository.findById(providerId)
            .orElseThrow(() -> new RuntimeException("Provider not found with id: " + providerId));
        return convertToDTO(provider);
    }

    public ProviderProfileDTO updateProviderProfile(String providerId, @Valid ProviderProfileDTO profileDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new RuntimeException(getValidationErrors(bindingResult));
        }

        Provider provider = providerRepository.findById(providerId)
            .orElseThrow(() -> new RuntimeException("Provider not found with id: " + providerId));

        updateProviderFromDTO(provider, profileDTO);
        Provider updatedProvider = providerRepository.save(provider);
        return convertToDTO(updatedProvider);
    }

    private ProviderProfileDTO convertToDTO(Provider provider) {
        ProviderProfileDTO dto = new ProviderProfileDTO();
        dto.setId(provider.getId());
        dto.setFullName(provider.getFullName());
        dto.setEmail(provider.getEmail());
        dto.setPhone(provider.getPhone());
        dto.setDateOfBirth(provider.getDateOfBirth());
        dto.setGender(provider.getGender());
        dto.setCurrentCity(provider.getCurrentCity());
        dto.setGovtIdType(provider.getGovtIdType());
        dto.setGovtIdNumber(provider.getGovtIdNumber());
        dto.setEmergencyContactName(provider.getEmergencyContactName());
        dto.setEmergencyContactNumber(provider.getEmergencyContactNumber());
        dto.setRole(provider.getRole());
        dto.setUserType(provider.getUserType());
        return dto;
    }

    private void updateProviderFromDTO(Provider provider, ProviderProfileDTO dto) {
        provider.setFullName(dto.getFullName());
        provider.setPhone(dto.getPhone());
        provider.setDateOfBirth(dto.getDateOfBirth());
        provider.setGender(dto.getGender());
        provider.setCurrentCity(dto.getCurrentCity());
        provider.setGovtIdType(dto.getGovtIdType());
        provider.setGovtIdNumber(dto.getGovtIdNumber());
        provider.setEmergencyContactName(dto.getEmergencyContactName());
        provider.setEmergencyContactNumber(dto.getEmergencyContactNumber());
    }

    private String getValidationErrors(BindingResult bindingResult) {
        List<FieldError> errors = bindingResult.getFieldErrors();
        return errors.stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .reduce((error1, error2) -> error1 + ", " + error2)
            .orElse("Validation failed");
    }
} 