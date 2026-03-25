package com.example.demo.controller;

import com.example.demo.dto.BookingRequest;
import com.example.demo.model.Booking;
import com.example.demo.model.TravelPackage;
import com.example.demo.repository.TravelPackageRepository;
import com.example.demo.service.BookingService;

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
    public Booking createBooking(@RequestBody BookingRequest request) {
        return service.createBooking(request);
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
}