package com.yaritrip.backend.controller;

import com.yaritrip.backend.model.City;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.dto.ActivityDTO;
import com.yaritrip.backend.dto.CreatePackageRequest;
import com.yaritrip.backend.dto.ItineraryDTO;
import com.yaritrip.backend.dto.PackageResponse;
import com.yaritrip.backend.service.PackageImageService;
import com.yaritrip.backend.service.TravelPackageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Collections;
import java.util.Comparator;

@Slf4j
@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TravelPackageController {

    private final TravelPackageRepository repository;
    private final PackageImageService imageService;
    private final TravelPackageService packageService;

    /* ================= GET ALL PACKAGES ================= */
    @GetMapping
    public ResponseEntity<List<PackageResponse>> getAllPackages() {

        // ✅ FIX: FETCH WITH CITIES
        List<TravelPackage> packages = repository.findAllWithCities();

        List<PackageResponse> response = packages.stream().map(pkg -> {

            String fromCity = pkg.getFromCity() != null ? pkg.getFromCity().getName() : "Unknown";
            String toCity = pkg.getToCity() != null ? pkg.getToCity().getName() : "Unknown";

            List<String> images;
            try {
                images = imageService.getImagesForDestination(toCity);
            } catch (Exception e) {
                log.error("Error fetching images for {}", toCity, e);
                images = Collections.emptyList();
            }

            return PackageResponse.builder()
                    .id(pkg.getId())
                    .title(fromCity + " to " + toCity)
                    .location(toCity)
                    .nights(pkg.getTotalDays())
                    .price(pkg.getPrice())
                    .rating(pkg.getRating() != null ? pkg.getRating() : 4.5)
                    .image(pkg.getBannerImageUrl() != null ? pkg.getBannerImageUrl() : "")
                    .images(images.isEmpty()
                            ? List.of("/images/packages/default.jpg")
                            : images)
                    .overview(pkg.getOverview())
                    .build();

        }).toList();

        return ResponseEntity.ok(response);
    }

    /* ================= GET PACKAGE BY ID ================= */
    @GetMapping("/{id}")
    public ResponseEntity<PackageResponse> getPackageById(@PathVariable UUID id) {

        // ✅ FIX: FETCH FULL DETAILS
        TravelPackage pkg = repository.findByIdWithImages(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        String fromCity = pkg.getFromCity() != null ? pkg.getFromCity().getName() : "Unknown";
        String toCity = pkg.getToCity() != null ? pkg.getToCity().getName() : "Unknown";

        PackageResponse response = new PackageResponse();

        response.setId(pkg.getId());
        response.setTitle(fromCity + " to " + toCity);
        response.setLocation(toCity);
        response.setNights(pkg.getTotalDays() - 1);
        response.setPrice(pkg.getPrice());
        response.setRating(pkg.getRating());
        response.setOverview(pkg.getOverview());

        response.setImage(
                pkg.getBannerImageUrl() != null
                        ? "http://localhost:8082" + pkg.getBannerImageUrl()
                        : "");

        if (pkg.getImages() != null) {
            response.setImages(
                    pkg.getImages().stream()
                            .map(img -> "http://localhost:8082" + img.getImageUrl())
                            .toList());
        }

        List<String> images;
        try {
            images = imageService.getImagesForDestination(toCity);
        } catch (Exception e) {
            log.error("Error fetching images for {}", toCity, e);
            images = Collections.emptyList();
        }

        response.setImages(
                images.isEmpty()
                        ? List.of("/images/packages/default.jpg")
                        : images);

        // ITINERARY
        if (pkg.getItineraries() != null) {
            response.setItinerary(
                    pkg.getItineraries().stream()
                            .sorted(Comparator.comparingInt(i -> i.getDayNumber()))
                            .map(i -> new ItineraryDTO(
                                    i.getDayNumber(),
                                    i.getTitle(),
                                    i.getDescription()))
                            .toList());
        }

        // ACTIVITIES
        if (pkg.getActivities() != null) {
            response.setActivities(
                    pkg.getActivities().stream().map(a -> ActivityDTO.builder()
                            .name(a.getName())
                            .description(a.getDescription())
                            .price(a.getPrice())
                            .build()).toList());
        }

        return ResponseEntity.ok(response);
    }

    /* ================= CREATE PACKAGE ================= */
    @PostMapping("/admin/packages")
    public ResponseEntity<?> createPackage(@RequestBody CreatePackageRequest request) {

        // ✅ USE SERVICE (handles city creation properly)
        TravelPackage saved = packageService.createPackage(request);

        return ResponseEntity.ok(saved);
    }
}