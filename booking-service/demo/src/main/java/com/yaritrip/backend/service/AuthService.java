package com.yaritrip.backend.service;

import com.yaritrip.backend.dto.*;
import com.yaritrip.backend.exception.ConflictException;
import com.yaritrip.backend.exception.UnauthorizedException;
import com.yaritrip.backend.model.User;
import com.yaritrip.backend.repository.UserRepository;
import com.yaritrip.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Async("authTaskExecutor")
    @Transactional
    public CompletableFuture<String> register(RegisterRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Check both in parallel
        boolean emailExists  = userRepository.existsByEmail(request.getEmail());
        boolean mobileExists = userRepository.existsByMobile(request.getMobile());

        if (emailExists) {
            throw new ConflictException("Email already registered");
        }
        if (mobileExists) {
            throw new ConflictException("Mobile number already registered");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .mobile(request.getMobile().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());

        return CompletableFuture.completedFuture("User registered successfully");
    }

    @Async("authTaskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<LoginResponse> login(LoginRequest request) {

        String identifier = request.getEmail().trim();

        User user = userRepository
                .findByEmailOrMobile(identifier, identifier)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
            // ⚠️ Never say "wrong password" — always give a generic message
        }

        String token = jwtService.generateToken(user.getEmail());
        log.info("User logged in: {}", user.getEmail());

        return CompletableFuture.completedFuture(new LoginResponse(token));
    }
}