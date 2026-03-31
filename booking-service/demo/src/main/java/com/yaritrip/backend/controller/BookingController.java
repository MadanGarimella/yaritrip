package com.yaritrip.backend.controller;

import com.yaritrip.backend.dto.BookingRequest;
import com.yaritrip.backend.model.Booking;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.service.BookingService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService service;
    private final TravelPackageRepository travelPackageRepository;

    // ✅ CREATE BOOKING
    @PostMapping
    public Booking createBooking(
            @RequestBody BookingRequest request,
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();

        return service.createBooking(request, email);
    }

    // ✅ GET BOOKING + PACKAGE (SAFE VERSION)
    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable String id) {

        Booking booking = service.getBookingById(id);

        TravelPackage pkg = null;

        if (booking.getPackageId() != null) {
            pkg = travelPackageRepository
                    .findById(booking.getPackageId())
                    .orElse(null);
        }

        // 🔥 DEBUG LOGS (VERY IMPORTANT)
        System.out.println("BOOKING ID: " + booking.getId());
        System.out.println("PACKAGE ID: " + booking.getPackageId());
        System.out.println("PACKAGE FOUND: " + (pkg != null));

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("booking", booking);
        response.put("package", pkg);

        return ResponseEntity.ok(response);
    }

    // ✅ UPDATE TRAVELLERS
    @PutMapping("/{id}/travellers")
    public Booking updateTravellers(
            @PathVariable String id,
            @RequestBody BookingRequest request) {
        return service.updateTravellers(id, request);
    }

    @PostMapping("/{id}/confirm")
    public Booking confirmBooking(
            @PathVariable String id,
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();

        return service.confirmBooking(
                java.util.UUID.fromString(id),
                email);
    }
}