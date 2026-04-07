package com.yaritrip.backend.controller;

import com.yaritrip.backend.dto.AttractionPackageResponse;
import com.yaritrip.backend.dto.CreateAttractionPackageRequest;
import com.yaritrip.backend.model.AttractionPackage;
import com.yaritrip.backend.service.AttractionPackageService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AttractionPackageController {

    private final AttractionPackageService service;

    @PostMapping("/attraction-packages")
    public AttractionPackage createPackage(@RequestBody CreateAttractionPackageRequest request) {
        return service.createPackage(request);
    }

    @GetMapping("/attraction-packages/{id}")
    public ResponseEntity<AttractionPackageResponse> getById(@PathVariable UUID id) {

        AttractionPackage pkg = service.getPackage(id);

        return ResponseEntity.ok(buildResponse(pkg));
    }

    @GetMapping("/attractions/{attractionId}/package")
    public ResponseEntity<?> getByAttractionId(@PathVariable UUID attractionId) {

        AttractionPackage pkg = service.getPackageByAttractionId(attractionId);

        if (pkg == null) {
            return ResponseEntity.status(404)
                    .body("No package found for this attraction");
        }

        return ResponseEntity.ok(buildResponse(pkg));
    }

    private AttractionPackageResponse buildResponse(AttractionPackage pkg) {

        return AttractionPackageResponse.builder()
                .id(pkg.getId())
                .title(pkg.getTitle())
                .location(pkg.getLocation())
                .nights(pkg.getNights())
                .price(pkg.getPrice())
                .rating(pkg.getRating() != null ? pkg.getRating() : 4.5)
                .image("http://localhost:8082" + pkg.getImageUrl())
                // .image("http://192.168.1.11:8082" + pkg.getImageUrl())
                .images(List.of("http://localhost:8082" + pkg.getImageUrl()))
                // .images(List.of("http://192.168.1.11:8082" + pkg.getImageUrl()))
                .overview(pkg.getOverview())
                .travelPackageId(
                        pkg.getTravelPackage() != null ? pkg.getTravelPackage().getId() : null)
                .build();
    }
}