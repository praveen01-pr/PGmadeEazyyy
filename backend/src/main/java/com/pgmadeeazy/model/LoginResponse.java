package com.pgmadeeazy.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String userType;
    private String id;
    private String name;
    private String email;
}
