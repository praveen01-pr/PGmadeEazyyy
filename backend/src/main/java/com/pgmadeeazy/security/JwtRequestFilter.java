package com.pgmadeeazy.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import io.jsonwebtoken.Claims;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        logger.info("Processing request to: {}", request.getRequestURI());
        logger.info("Authorization header: {}", authorizationHeader);

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                logger.info("Extracted username from token: {}", username);
                
                // Log the token contents for debugging
                logger.info("Token contents - role: {}, spring_role: {}", 
                    jwtUtil.extractClaim(jwt, claims -> claims.get("role", String.class)),
                    jwtUtil.extractClaim(jwt, claims -> claims.get("spring_role", String.class))
                );

                // Get all claims from token
                Claims claims = jwtUtil.extractAllClaims(jwt);
                logger.info("All token claims: {}", claims);
            } catch (Exception e) {
                logger.error("Error extracting username from token: {}", e.getMessage());
            }
        } else {
            logger.warn("JWT Token does not begin with Bearer String");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            logger.info("Attempting to authenticate user: {}", username);
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                logger.info("Loaded user details with authorities: {}", userDetails.getAuthorities());

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    logger.info("Token validated successfully");
                    UsernamePasswordAuthenticationToken authenticationToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, 
                            null,
                            userDetails.getAuthorities()
                        );
                    authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    logger.info("Authentication set in SecurityContext with authorities: {}", 
                        SecurityContextHolder.getContext().getAuthentication().getAuthorities());
                    logger.info("User authenticated successfully: {}", username);
                } else {
                    logger.error("Token validation failed");
                }
            } catch (Exception e) {
                logger.error("Error during authentication: {}", e.getMessage());
            }
        } else {
            logger.warn("Username is null or authentication already exists. Username: {}, Has Authentication: {}", 
                username, SecurityContextHolder.getContext().getAuthentication() != null);
        }
        logger.info("Filter chain executed");
        chain.doFilter(request, response);
    }
}
