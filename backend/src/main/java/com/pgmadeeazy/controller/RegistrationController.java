package com.pgmadeeazy.controller;

import com.pgmadeeazy.model.Provider;
import com.pgmadeeazy.model.Seeker;
import com.pgmadeeazy.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/register")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RegistrationController {
    private final RegistrationService registrationService;

    @PostMapping("/seeker")
    public ResponseEntity<?> registerSeeker(@RequestBody Seeker seeker, BindingResult bindingResult) {
        try {
            Seeker registeredSeeker = registrationService.registerSeeker(seeker, bindingResult);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredSeeker);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/provider")
    public ResponseEntity<?> registerProvider(@RequestBody Provider provider, BindingResult bindingResult) {
        try {
            Provider registeredProvider = registrationService.registerProvider(provider, bindingResult);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredProvider);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}