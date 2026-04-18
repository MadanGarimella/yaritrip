package com.yaritrip.backend.controller;

import com.yaritrip.backend.dto.BookingRequest;
import com.yaritrip.backend.dto.BookingDetailsResponse;
import com.yaritrip.backend.model.Booking;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.service.BookingService;
import com.yaritrip.backend.repository.TravelPackageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://192.168.1.20:5173"
}, allowCredentials = "true")
public class BookingController {

    private final BookingService bookingService;
    private final TravelPackageRepository travelPackageRepository;

    private String getAuthenticatedEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            log.error("Unauthorized access attempt");
            throw new AccessDeniedException("User not authenticated");
        }
        return authentication.getName();
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication) {

        String email = getAuthenticatedEmail(authentication);
        Booking booking = bookingService.createBooking(request, email);

        return ResponseEntity.ok(booking);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDetailsResponse> getBooking(@PathVariable UUID id) {

        Booking booking = bookingService.getBookingById(id);

        TravelPackage pkg = travelPackageRepository.findById(booking.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        return ResponseEntity.ok(new BookingDetailsResponse(booking, pkg));
    }

    @PutMapping("/{id}/travellers")
    public ResponseEntity<Booking> updateTravellers(
            @PathVariable UUID id,
            @RequestBody BookingRequest request,
            Authentication authentication) {

        String email = getAuthenticatedEmail(authentication);

        Booking updated = bookingService.updateTravellers(id, request);

        return ResponseEntity.ok(updated); // ✅ FIXED (was "bookings")
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<Booking> confirmBooking(
            @PathVariable UUID id,
            Authentication authentication) {

        String email = getAuthenticatedEmail(authentication);

        Booking booking = bookingService.confirmBooking(id, email);

        return ResponseEntity.ok(booking);
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<?> createPayment(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.createPayment(id));
    }

    @PostMapping("/{id}/payment-success")
    public ResponseEntity<?> paymentSuccess(
            @PathVariable UUID id,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                bookingService.confirmBooking(id, email));
    }
}