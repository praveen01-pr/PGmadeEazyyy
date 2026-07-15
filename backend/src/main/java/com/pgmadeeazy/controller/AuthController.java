package com.pgmadeeazy.controller;

import com.pgmadeeazy.model.Provider;
import com.pgmadeeazy.model.Seeker;
import com.pgmadeeazy.model.Admin;
import com.pgmadeeazy.model.LoginRequest;
import com.pgmadeeazy.model.LoginResponse;
import com.pgmadeeazy.repository.ProviderRepository;
import com.pgmadeeazy.repository.SeekerRepository;
import com.pgmadeeazy.repository.AdminRepository;
import com.pgmadeeazy.security.JWTUtil;
import com.pgmadeeazy.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private SeekerRepository seekerRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Object userData) {
        try {
            if (userData instanceof Seeker seeker) {
                seeker.setPassword(passwordEncoder.encode(seeker.getPassword()));
                seekerRepository.save(seeker);
                return ResponseEntity.status(HttpStatus.CREATED).body("Seeker registered successfully");
            } else if (userData instanceof Provider provider) {
                provider.setPassword(passwordEncoder.encode(provider.getPassword()));
                providerRepository.save(provider);
                return ResponseEntity.status(HttpStatus.CREATED).body("Provider registered successfully");
            }
            return ResponseEntity.badRequest().body("Invalid user type");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Check if user exists
            Seeker seeker = seekerRepository.findByEmail(loginRequest.getEmail());
            Provider provider = providerRepository.findByEmail(loginRequest.getEmail());
            Admin admin = adminRepository.findByEmail(loginRequest.getEmail());

            if (admin != null) {
                if (admin.getPassword().equals(loginRequest.getPassword())) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(admin.getEmail());
                    String token = jwtUtil.generateToken(userDetails);
                    return ResponseEntity.ok().body(new LoginResponse(
                        token,
                        "admin",
                        admin.getId(),
                        admin.getFullName(),
                        admin.getEmail()
                    ));
                }
            } else if (seeker != null) {
                if (passwordEncoder.matches(loginRequest.getPassword(), seeker.getPassword())) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(seeker.getEmail());
                    String token = jwtUtil.generateToken(userDetails);
                    return ResponseEntity.ok().body(new LoginResponse(
                        token,
                        "seeker",
                        seeker.getId(),
                        seeker.getFullName(),
                        seeker.getEmail()
                    ));
                }
            } else if (provider != null) {
                if (passwordEncoder.matches(loginRequest.getPassword(), provider.getPassword())) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(provider.getEmail());
                    String token = jwtUtil.generateToken(userDetails);
                    return ResponseEntity.ok().body(new LoginResponse(
                        token,
                        "provider",
                        provider.getId(),
                        provider.getFullName(),
                        provider.getEmail()
                    ));
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Login failed: " + e.getMessage());
        }
    }

    @GetMapping("/test-cors")
    public ResponseEntity<String> testCors() {
        return ResponseEntity.ok("CORS is working!");
    }
}
