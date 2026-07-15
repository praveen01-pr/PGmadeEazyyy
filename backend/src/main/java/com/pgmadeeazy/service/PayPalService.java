package com.pgmadeeazy.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class PayPalService {

    private static final Logger logger = LoggerFactory.getLogger(PayPalService.class);

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.base.url}")
    private String paypalBaseUrl;

    @Autowired
    private RestTemplate restTemplate;

    private String getAccessToken() {
        try {
            String auth = Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Authorization", "Basic " + auth);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "client_credentials");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                paypalBaseUrl + "/v1/oauth2/token",
                request,
                Map.class
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null || !responseBody.containsKey("access_token")) {
                throw new RuntimeException("Failed to get access token from PayPal");
            }

            return (String) responseBody.get("access_token");
        } catch (Exception e) {
            logger.error("Error getting PayPal access token: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get PayPal access token: " + e.getMessage());
        }
    }

    public Map<String, String> createPayment(String bookingId, Double total, String currency, String description,
                                           String returnUrl, String cancelUrl) {
        try {
            // Validate input parameters
            if (total == null) {
                throw new IllegalArgumentException("Total amount cannot be null");
            }
            if (currency == null || currency.trim().isEmpty()) {
                throw new IllegalArgumentException("Currency cannot be null or empty");
            }
            if (description == null || description.trim().isEmpty()) {
                throw new IllegalArgumentException("Description cannot be null or empty");
            }
            if (returnUrl == null || returnUrl.trim().isEmpty()) {
                throw new IllegalArgumentException("Return URL cannot be null or empty");
            }
            if (cancelUrl == null || cancelUrl.trim().isEmpty()) {
                throw new IllegalArgumentException("Cancel URL cannot be null or empty");
            }

            logger.info("Creating PayPal payment with parameters: bookingId={}, total={}, currency={}, description={}, returnUrl={}, cancelUrl={}",
                    bookingId, total, currency, description, returnUrl, cancelUrl);

            // Format amount
            total = new BigDecimal(total).setScale(2, RoundingMode.HALF_UP).doubleValue();
            String formattedAmount = String.format("%.2f", total);

            logger.debug("Formatted amount: {}", formattedAmount);

            // Get access token
            String accessToken = getAccessToken();
            logger.debug("Got PayPal access token");

            // Prepare request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("intent", "sale");
            requestBody.put("payer", Map.of("payment_method", "paypal"));
            requestBody.put("transactions", List.of(Map.of(
                "amount", Map.of(
                    "total", formattedAmount,
                    "currency", currency
                ),
                "description", description
            )));
            requestBody.put("redirect_urls", Map.of(
                "return_url", returnUrl,
                "cancel_url", cancelUrl
            ));

            logger.debug("PayPal request body: {}", requestBody);

            // Set headers with access token
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + accessToken);

            // Create request entity
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            // Make API call
            logger.debug("Making PayPal API call to create payment");
            ResponseEntity<Map> response = restTemplate.postForEntity(
                paypalBaseUrl + "/v1/payments/payment",
                request,
                Map.class
            );

            logger.debug("PayPal API response status: {}", response.getStatusCode());
            logger.debug("PayPal API response body: {}", response.getBody());

            Map<String, String> result = new HashMap<>();
            Map<String, Object> responseBody = response.getBody();
            
            if (responseBody == null) {
                throw new RuntimeException("No response body received from PayPal");
            }

            // Extract payment ID and approval URL
            Object paymentIdObj = responseBody.get("id");
            if (paymentIdObj == null) {
                throw new RuntimeException("No payment ID received from PayPal");
            }
            String paymentId = paymentIdObj.toString();
            result.put("paymentId", paymentId);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> links = (List<Map<String, Object>>) responseBody.get("links");
            if (links == null) {
                throw new RuntimeException("No links received from PayPal");
            }

            String approvalUrl = null;
            for (Map<String, Object> link : links) {
                Object relObj = link.get("rel");
                Object hrefObj = link.get("href");
                if (relObj != null && "approval_url".equals(relObj.toString()) && hrefObj != null) {
                    approvalUrl = hrefObj.toString();
                    break;
                }
            }

            if (approvalUrl == null) {
                throw new RuntimeException("No approval URL received from PayPal");
            }
            result.put("approvalUrl", approvalUrl);

            logger.info("PayPal payment created successfully with ID: {}", result.get("paymentId"));
            return result;
        } catch (Exception e) {
            logger.error("Error creating PayPal payment: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create payment: " + e.getMessage());
        }
    }

    public Map<String, Object> executePayment(String paymentId, String payerId) {
        try {
            logger.info("Executing PayPal payment with paymentId={}, payerId={}", paymentId, payerId);

            // Get access token
            String accessToken = getAccessToken();

            // Prepare request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("payer_id", payerId);

            // Set headers with access token
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + accessToken);

            // Create request entity
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            // Make API call
            ResponseEntity<Map> response = restTemplate.postForEntity(
                paypalBaseUrl + "/v1/payments/payment/" + paymentId + "/execute",
                request,
                Map.class
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                throw new RuntimeException("No response body received from PayPal");
            }

            logger.info("PayPal payment executed successfully");
            return responseBody;
        } catch (Exception e) {
            logger.error("Error executing PayPal payment: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to execute payment: " + e.getMessage());
        }
    }
} 