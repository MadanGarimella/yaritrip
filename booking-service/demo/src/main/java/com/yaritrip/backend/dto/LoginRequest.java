package com.yaritrip.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email or mobile is required")
    private String email; // accepts email OR mobile

    @NotBlank(message = "Password is required")
    private String password;
}