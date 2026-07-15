package com.pgmadeeazy.controller;

import com.pgmadeeazy.dto.ProviderProfileDTO;
import com.pgmadeeazy.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    @Autowired
    private ProviderService providerService;

    @GetMapping("/{providerId}/profile")
    public ResponseEntity<ProviderProfileDTO> getProviderProfile(@PathVariable String providerId) {
        try {
            ProviderProfileDTO profile = providerService.getProviderProfile(providerId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{providerId}/profile")
    public ResponseEntity<ProviderProfileDTO> updateProviderProfile(
            @PathVariable String providerId,
            @RequestBody ProviderProfileDTO profileDTO,
            BindingResult bindingResult) {
        try {
            ProviderProfileDTO updatedProfile = providerService.updateProviderProfile(providerId, profileDTO, bindingResult);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 