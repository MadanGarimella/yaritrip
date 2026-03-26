package com.yaritrip.backend.controller;

import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.service.TravelPackageService;
import com.yaritrip.backend.dto.PriceRequest;
import com.yaritrip.backend.dto.PriceResponse;
import com.yaritrip.backend.dto.PackageResponse;
import com.yaritrip.backend.service.PackageImageService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TravelPackageController {

        private final TravelPackageRepository repository;
        private final TravelPackageService service;
        private final PackageImageService imageService;

        @GetMapping
        public List<TravelPackage> getAllPackages() {
                return repository.findAll();
        }

        @GetMapping("/{id}")
        public ResponseEntity<PackageResponse> getById(@PathVariable UUID id) {

                TravelPackage pkg = repository.findByIdWithImages(id)
                                .orElseThrow(() -> new RuntimeException("Package not found"));
                String destination = pkg.getToCity() != null
                                ? pkg.getToCity().getName()
                                : "default";

                List<String> images = imageService.getImagesForDestination(destination);
                PackageResponse response = PackageResponse.builder()
                                .id(pkg.getId())
                                .title(pkg.getFromCity().getName() + " to " + pkg.getToCity().getName())
                                .location(pkg.getToCity() != null ? pkg.getToCity().getName() : "Unknown")
                                .nights(pkg.getTotalDays())
                                .price(pkg.getPrice())
                                .rating(pkg.getRating() != null ? pkg.getRating() : 4.5)
                                .image("http://localhost:8082" + pkg.getBannerImageUrl())
                                .images(images.isEmpty()
                                                ? List.of("/images/packages/default.jpg")
                                                : images)
                                .overview(pkg.getOverview())
                                .build();

                return ResponseEntity.ok(response);
        }

        @PostMapping("/{id}/calculate")
        public PriceResponse calculatePrice(
                        @PathVariable UUID id,
                        @RequestBody PriceRequest request) {
                return service.calculatePrice(id, request.getActivityIds());
        }

}