package com.yaritrip.backend.controller;

import com.yaritrip.backend.dto.UpdatePackageRequest;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.service.AdminService;
import com.yaritrip.backend.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService; // for user deletion

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/revenue/monthly")
    public ResponseEntity<?> getRevenue() {
        return ResponseEntity.ok(adminService.getMonthlyRevenue());
    }

    @GetMapping("/bookings/destination")
    public ResponseEntity<?> getDestinations() {
        return ResponseEntity.ok(adminService.getBookingsByDestination());
    }

    @GetMapping("/bookings/recent")
    public ResponseEntity<?> getRecentBookings() {
        return ResponseEntity.ok(adminService.getRecentBookings());
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }
}