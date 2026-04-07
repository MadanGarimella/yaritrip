package com.yaritrip.backend.controller;

import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.dto.PackageResponse;
import com.yaritrip.backend.service.PackageImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Collections;

@Slf4j
@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TravelPackageController {

    private final TravelPackageRepository repository;
    private final PackageImageService imageService;

    @GetMapping
    public ResponseEntity<List<PackageResponse>> getAllPackages() {

        List<TravelPackage> packages = repository.findAll();

        List<PackageResponse> response = packages.stream().map(pkg -> {

            String fromCity = pkg.getFromCity() != null ? pkg.getFromCity().getName() : "Unknown";
            String toCity = pkg.getToCity() != null ? pkg.getToCity().getName() : "Unknown";

            List<String> images;
            try {
                images = imageService.getImagesForDestination(toCity);
            } catch (Exception e) {
                images = Collections.emptyList();
            }

            return PackageResponse.builder()
                    .id(pkg.getId())
                    .title(fromCity + " to " + toCity)
                    .location(toCity)
                    .nights(pkg.getTotalDays())
                    .price(pkg.getPrice()) // ✅ REAL PRICE
                    .rating(pkg.getRating() != null ? pkg.getRating() : 4.5)
                    .image(pkg.getBannerImageUrl() != null
                            ? "http://localhost:8082" + pkg.getBannerImageUrl()
                            : "")
                    .images(images.isEmpty()
                            ? List.of("/images/packages/default.jpg")
                            : images)
                    .overview(pkg.getOverview())
                    .build();

        }).toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackageResponse> getPackageById(@PathVariable UUID id) {

        TravelPackage pkg = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        String fromCity = pkg.getFromCity() != null ? pkg.getFromCity().getName() : "Unknown";
        String toCity = pkg.getToCity() != null ? pkg.getToCity().getName() : "Unknown";

        List<String> images;
        try {
            images = imageService.getImagesForDestination(toCity);
        } catch (Exception e) {
            images = Collections.emptyList();
        }

        PackageResponse response = PackageResponse.builder()
                .id(pkg.getId())
                .title(fromCity + " to " + toCity)
                .location(toCity)
                .nights(pkg.getTotalDays())
                .price(pkg.getPrice()) // ✅ FIXED
                .rating(pkg.getRating() != null ? pkg.getRating() : 4.5)
                .image(pkg.getBannerImageUrl() != null
                        ? "http://localhost:8082" + pkg.getBannerImageUrl()
                        : "")
                .images(images.isEmpty()
                        ? List.of("/images/packages/default.jpg")
                        : images)
                .overview(pkg.getOverview())
                .build();

        return ResponseEntity.ok(response);
    }
}