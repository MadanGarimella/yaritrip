package com.yaritrip.backend.controller;

import com.yaritrip.backend.dto.PackageResponse;
import com.yaritrip.backend.dto.UpdatePackageRequest;
import com.yaritrip.backend.dto.ActivityDTO;
import com.yaritrip.backend.dto.ItineraryDTO;
import com.yaritrip.backend.dto.CreatePackageRequest;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.service.TravelPackageService;
import com.yaritrip.backend.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/packages")
@RequiredArgsConstructor
public class AdminPackageController {

    private final TravelPackageRepository repo;
    private final TravelPackageService service;
    private final BookingRepository bookingRepo;

    // ================= CREATE PACKAGE =================
    @PostMapping
    public ResponseEntity<?> createPackage(@RequestBody CreatePackageRequest request) {

        TravelPackage saved = service.createPackage(request);

        return ResponseEntity.ok(convertToResponse(saved));
    }

    // ================= GET ALL PACKAGES =================
    @GetMapping
    public List<Map<String, Object>> getAllPackages() {

        // 🔥 Booking count aggregation
        Map<UUID, Long> bookingMap = bookingRepo.countBookingsGroupedByPackage()
                .stream()
                .collect(Collectors.toMap(
                        obj -> (UUID) obj[0],
                        obj -> (Long) obj[1]));

        return repo.findAllWithCities().stream().map(pkg -> {

            Map<String, Object> map = new HashMap<>();

            String from = pkg.getFromCity() != null ? pkg.getFromCity().getName() : "Unknown";
            String to = pkg.getToCity() != null ? pkg.getToCity().getName() : "Unknown";

            map.put("id", pkg.getId());
            map.put("name", from + " to " + to);
            map.put("location", to);
            map.put("duration", (pkg.getTotalDays() != null ? pkg.getTotalDays() : 0) + " Days");
            map.put("price", pkg.getPrice());

            // ✅ FIXED BOOKING COUNT
            long bookingCount = bookingMap.getOrDefault(pkg.getId(), 0L);
            map.put("bookings", bookingCount);

            map.put("status", "Active");

            map.put("updated",
                    pkg.getDepartureDate() != null
                            ? pkg.getDepartureDate().toString()
                            : "N/A");

            map.put("image",
                    pkg.getBannerImageUrl() != null
                            ? "http://localhost:8082" + pkg.getBannerImageUrl()
                            : "");

            return map;

        }).toList();
    }

    // ================= GET PACKAGE BY ID =================
    @Transactional
    @GetMapping("/{id}")
    public ResponseEntity<PackageResponse> getPackageById(@PathVariable UUID id) {

        // 🔥 IMPORTANT FIX → fetch all lazy relations
        TravelPackage pkg = repo.findByIdWithImages(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        return ResponseEntity.ok(convertToResponse(pkg));
    }

    // ================= UPDATE PACKAGE =================
    @PutMapping("/{id}")
    public ResponseEntity<PackageResponse> updatePackage(
            @PathVariable UUID id,
            @RequestBody UpdatePackageRequest request) {

        TravelPackage updated = service.updatePackage(id, request);
        return ResponseEntity.ok(convertToResponse(updated));
    }

    // ================= IMAGE UPLOAD =================
    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadImage(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(service.uploadImage(id, file));
    }

    // ================= RESPONSE MAPPER =================
    private PackageResponse convertToResponse(TravelPackage tp) {

        // 🔥 SAFE COLLECTION HANDLING (NO LAZY CRASH)
        List<String> images = tp.getImages() != null
                ? tp.getImages().stream()
                        .map(img -> "http://localhost:8082" + img.getImageUrl())
                        .toList()
                : List.of();

        List<ActivityDTO> activities = tp.getActivities() != null
                ? tp.getActivities().stream().map(a -> {
                    ActivityDTO dto = new ActivityDTO();
                    dto.setName(a.getName());
                    dto.setPrice(a.getPrice());
                    dto.setDescription(a.getDescription());
                    return dto;
                }).toList()
                : List.of();

        List<ItineraryDTO> itinerary = tp.getItineraries() != null
                ? tp.getItineraries().stream()
                        .sorted(Comparator.comparingInt(i -> i.getDayNumber()))
                        .map(i -> {
                            ItineraryDTO dto = new ItineraryDTO();
                            dto.setDayNumber(i.getDayNumber());
                            dto.setTitle("Day " + i.getDayNumber());
                            dto.setDescription(i.getDescription());
                            return dto;
                        }).toList()
                : List.of();

        PackageResponse res = new PackageResponse();

        res.setId(tp.getId());

        String from = tp.getFromCity() != null ? tp.getFromCity().getName() : "Unknown";
        String to = tp.getToCity() != null ? tp.getToCity().getName() : "Unknown";

        res.setTitle(from + " to " + to);
        res.setLocation(to);

        res.setPrice(tp.getPrice());
        res.setOverview(tp.getOverview());
        res.setRating(tp.getRating());

        // ✅ SAFE IMAGE
        res.setImage(images.isEmpty() ? "" : images.get(0));

        // nights
        res.setNights(
                tp.getTotalDays() != null && tp.getTotalDays() > 0
                        ? tp.getTotalDays() - 1
                        : 0);

        res.setActivities(activities);
        res.setItinerary(itinerary);
        res.setImages(images);

        return res;
    }
}