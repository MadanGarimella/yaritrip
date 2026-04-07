package com.yaritrip.backend.security;

import com.yaritrip.backend.repository.UserRepository;
import com.yaritrip.backend.repository.BlacklistedTokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final BlacklistedTokenRepository blacklistedTokenRepository;

    public JwtAuthenticationFilter(JwtService jwtService,
                                   UserRepository userRepository,
                                   BlacklistedTokenRepository blacklistedTokenRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.blacklistedTokenRepository = blacklistedTokenRepository;
    }

@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain)
        throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");

    // ✅ No token → allow request (public endpoints)
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }

    String token = authHeader.substring(7);

    // ❌ BLACKLIST CHECK
    if (blacklistedTokenRepository.existsByToken(token)) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Token is blacklisted");
        return;
    }

    // ❌ TOKEN VALIDATION
    if (!jwtService.isTokenValid(token)) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Invalid token");
        return;
    }

    String email = jwtService.extractEmail(token);

    var user = userRepository.findByEmail(email).orElse(null);

    // ❌ USER NOT FOUND → CRITICAL FIX
    if (user == null) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("User not found");
        return;
    }

    // ✅ SET AUTHENTICATION
    if (SecurityContextHolder.getContext().getAuthentication() == null) {

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        List.of()
                );

        authToken.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);
    }

    filterChain.doFilter(request, response);
}
}