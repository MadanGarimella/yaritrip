package com.yaritrip.backend.controller;

import com.yaritrip.backend.dto.BookingRequest;
import com.yaritrip.backend.model.Booking;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.service.BookingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://192.168.1.20:5173"
        },
        allowCredentials = "true"
)
public class BookingController {

    private final BookingService service;
    private final TravelPackageRepository travelPackageRepository;

    // ===============================
    // 🔐 HELPER METHOD (SECURE AUTH)
    // ===============================
    private String getAuthenticatedEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.error("Unauthorized access attempt to booking API");
            throw new AccessDeniedException("User not authenticated");
        }
        return authentication.getName();
    }

    // ===============================
    // ✅ CREATE BOOKING
    // ===============================
    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication) {

        String email = getAuthenticatedEmail(authentication);

        log.info("Creating booking for user: {}", email);

        Booking booking = service.createBooking(request, email);

        return ResponseEntity.ok(booking);
    }

    // ===============================
    // ✅ GET BOOKING + PACKAGE
    // ===============================
    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable String id) {

        Booking booking = service.getBookingById(id);

        TravelPackage pkg = null;

        if (booking.getPackageId() != null) {
            pkg = travelPackageRepository
                    .findById(booking.getPackageId())
                    .orElse(null);
        }

        log.info("Fetched booking: {}", booking.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("booking", booking);
        response.put("package", pkg);

        return ResponseEntity.ok(response);
    }

    // ===============================
    // ✅ UPDATE TRAVELLERS
    // ===============================
    @PutMapping("/{id}/travellers")
    public ResponseEntity<?> updateTravellers(
            @PathVariable String id,
            @RequestBody BookingRequest request,
            Authentication authentication) {

        String email = getAuthenticatedEmail(authentication);

        log.info("Updating travellers for booking: {} by user: {}", id, email);

        Booking updated = service.updateTravellers(id, request);

        return ResponseEntity.ok(updated);
    }

    // ===============================
    // ✅ CONFIRM BOOKING
    // ===============================
    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmBooking(
            @PathVariable String id,
            Authentication authentication) {

        String email = getAuthenticatedEmail(authentication);

        log.info("Confirming booking: {} by user: {}", id, email);

        Booking booking = service.confirmBooking(
                UUID.fromString(id),
                email
        );

        return ResponseEntity.ok(booking);
    }
}