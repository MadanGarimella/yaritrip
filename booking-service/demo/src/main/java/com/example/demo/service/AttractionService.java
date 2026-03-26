package com.example.demo.service;

import com.example.demo.dto.AttractionDetailResponse;
import com.example.demo.dto.AttractionUpdateRequest;
import com.example.demo.dto.AttractionResponse;
import com.example.demo.model.Attraction;
import com.example.demo.model.AttractionPackage;
import com.example.demo.repository.AttractionRepository;
import com.example.demo.repository.AttractionPackageRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttractionService {

    private final AttractionRepository attractionRepository;
    private final AttractionPackageRepository attractionPackageRepository;

    public Attraction create(Attraction attraction) {
        return attractionRepository.save(attraction);
    }

    public List<AttractionResponse> getPopularByCity(String city) {

        return attractionRepository
                .findByIsPopularTrueAndLocationIgnoreCaseOrderByRatingDesc(city)
                .stream()
                .map(this::mapToPopularResponse)
                .toList();
    }

    public AttractionDetailResponse getAttractionById(UUID id) {

        Attraction attraction = attractionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attraction not found"));

        return mapToDetailResponse(attraction);
    }

    public AttractionDetailResponse updateAttraction(UUID id, AttractionUpdateRequest request) {

        Attraction attraction = attractionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attraction not found"));

        attraction.setName(request.name());
        attraction.setLocation(request.location());
        attraction.setDescription(request.description());
        attraction.setImageUrl(request.imageUrl());
        attraction.setRating(request.rating());
        attraction.setIsPopular(request.isPopular());

        attractionRepository.save(attraction);

        return mapToDetailResponse(attraction);
    }

    // ---------- MAPPERS ----------

    private AttractionResponse mapToPopularResponse(Attraction a) {

        List<AttractionPackage> packages = attractionPackageRepository.findAllByAttractionId(a.getId());

        UUID packageId = packages.isEmpty() ? null : packages.get(0).getId();

        return new AttractionResponse(
                a.getId(),
                packageId,
                a.getName(),
                a.getLocation(),
                a.getDescription(),
                a.getImageUrl(),
                a.getRating() != null ? a.getRating() : 0.0,
                a.getReviews() != null ? a.getReviews() : 0);
    }

    private AttractionDetailResponse mapToDetailResponse(Attraction a) {

        return new AttractionDetailResponse(
                a.getId(),
                a.getName(),
                a.getLocation(),
                a.getDescription(),
                a.getImageUrl(),
                a.getRating() != null ? a.getRating() : 0.0,
                a.getReviews() != null ? a.getReviews() : 0);
    }
}