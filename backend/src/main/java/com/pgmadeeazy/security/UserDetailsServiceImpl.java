package com.pgmadeeazy.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pgmadeeazy.model.Admin;
import com.pgmadeeazy.model.Provider;
import com.pgmadeeazy.model.Seeker;
import com.pgmadeeazy.repository.AdminRepository;
import com.pgmadeeazy.repository.ProviderRepository;
import com.pgmadeeazy.repository.SeekerRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private SeekerRepository seekerRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Seeker seeker = seekerRepository.findByEmail(email);
        Provider provider = providerRepository.findByEmail(email);
        Admin admin = adminRepository.findByEmail(email);

        if (seeker != null) {
            return buildUserDetails(seeker.getEmail(), seeker.getPassword(), seeker.getRole());
        } else if (provider != null) {
            return buildUserDetails(provider.getEmail(), provider.getPassword(), provider.getRole());
        } else if (admin != null) {
            return buildUserDetails(admin.getEmail(), admin.getPassword(), admin.getRole());
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }

    private UserDetails buildUserDetails(String email, String password, String role) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        // Use exact role from database, just add ROLE_ prefix
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
        return new User(email, password, authorities);
    }
}
