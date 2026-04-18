package com.yaritrip.backend.controller;

import com.yaritrip.backend.dto.CreatePackageRequest;
import com.yaritrip.backend.dto.PackageResponse;
import com.yaritrip.backend.dto.TravellerRequest;
import com.yaritrip.backend.dto.UpdatePackageRequest;
import com.yaritrip.backend.service.TravelPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/packages")
@RequiredArgsConstructor
public class AdminPackageController {

    private final TravelPackageService service;

    @PostMapping
    public ResponseEntity<?> createPackage(@RequestBody CreatePackageRequest req) {
        return ResponseEntity.ok(service.createPackage(req));
    }
}