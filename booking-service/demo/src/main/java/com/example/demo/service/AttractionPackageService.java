package com.example.demo.service;

import com.example.demo.dto.CreateAttractionPackageRequest;
import com.example.demo.model.Attraction;
import com.example.demo.model.AttractionPackage;
import com.example.demo.model.TravelPackage;
import com.example.demo.repository.AttractionPackageRepository;
import com.example.demo.repository.AttractionRepository;
import com.example.demo.repository.TravelPackageRepository;

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
        return repository.findByAttractionId(attractionId).orElse(null);
    }

    public List<AttractionPackage> getAll() {
        return repository.findAll();
    }
}