package com.yaritrip.backend.service;

import com.yaritrip.backend.dto.CreateAttractionPackageRequest;
import com.yaritrip.backend.model.Attraction;
import com.yaritrip.backend.model.AttractionPackage;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.AttractionPackageRepository;
import com.yaritrip.backend.repository.AttractionRepository;
import com.yaritrip.backend.repository.TravelPackageRepository;

import java.util.List;
import org.springframework.data.repository.query.Param;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttractionPackageService {

    private final AttractionPackageRepository repository;
    private final AttractionRepository attractionRepository;
    private final TravelPackageRepository travelPackageRepository; // ✅ ADDED

    public AttractionPackage createPackage(CreateAttractionPackageRequest request) {

        List<Attraction> attractions = attractionRepository.findAllById(request.getAttractionIds());

        if (attractions.isEmpty()) {
            throw new RuntimeException("No valid attractions found for given IDs");
        }

        // ✅ FETCH REAL TRAVEL PACKAGE
        TravelPackage travelPackage = travelPackageRepository.findById(request.getTravelPackageId())
                .orElseThrow(() -> new RuntimeException("Travel Package not found"));

        AttractionPackage pkg = AttractionPackage.builder()
                .title(request.getTitle())
                .location(request.getLocation())
                .nights(request.getNights())
                .price(request.getPrice())
                .rating(request.getRating())
                .imageUrl(request.getImageUrl())
                .overview(request.getOverview())
                .attractions(attractions)
                .travelPackage(travelPackage) // ✅ CRITICAL FIX
                .build();

        return repository.save(pkg);
    }

    public AttractionPackage getPackage(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
    }

    public AttractionPackage getPackageByAttractionId(UUID attractionId) {

        List<AttractionPackage> packages = repository.findAllByAttractionId(attractionId);

        if (packages.isEmpty()) {
            return null;
        }

        return packages.get(0); // pick first to avoid crash
    }

    public List<AttractionPackage> getAll() {
        return repository.findAll();
    }
}