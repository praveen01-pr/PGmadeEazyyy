package com.pgmadeeazy.service;

import com.pgmadeeazy.model.Provider;
import com.pgmadeeazy.model.Seeker;
import com.pgmadeeazy.repository.ProviderRepository;
import com.pgmadeeazy.repository.SeekerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import jakarta.validation.Valid;
import java.util.List;

@Service
@RequiredArgsConstructor
@Validated
public class RegistrationService {
    private final SeekerRepository seekerRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public Seeker registerSeeker(@Valid Seeker seeker, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new RuntimeException(getValidationErrors(bindingResult));
        }

        if (seekerRepository.existsByEmail(seeker.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (seekerRepository.existsByPhone(seeker.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }

        // Encode password before saving
        seeker.setPassword(passwordEncoder.encode(seeker.getPassword()));
        Seeker savedSeeker = seekerRepository.save(seeker);

        // Send welcome email
        emailService.sendRegistrationEmail(
            savedSeeker.getEmail(),
            savedSeeker.getFullName(),
            "seeker"
        );

        return savedSeeker;
    }

    public Provider registerProvider(@Valid Provider provider, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new RuntimeException(getValidationErrors(bindingResult));
        }

        if (providerRepository.existsByEmail(provider.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Only check main phone number, not emergency contact number
        if (providerRepository.existsByPhone(provider.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }

        // Encode password before saving
        provider.setPassword(passwordEncoder.encode(provider.getPassword()));
        Provider savedProvider = providerRepository.save(provider);

        // Send welcome email
        emailService.sendRegistrationEmail(
            savedProvider.getEmail(),
            savedProvider.getFullName(),
            "provider"
        );

        return savedProvider;
    }

    private String getValidationErrors(BindingResult bindingResult) {
        List<FieldError> errors = bindingResult.getFieldErrors();
        return errors.stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .reduce((error1, error2) -> error1 + ", " + error2)
            .orElse("Validation failed");
    }
}