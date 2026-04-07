package com.yaritrip.backend.controller;

import com.yaritrip.backend.dto.AttractionDetailResponse;
import com.yaritrip.backend.dto.AttractionUpdateRequest;
import com.yaritrip.backend.dto.AttractionResponse;
import com.yaritrip.backend.model.Attraction;
import com.yaritrip.backend.service.AttractionService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attractions")
@RequiredArgsConstructor
public class AttractionController {

    private final AttractionService attractionService;

    @GetMapping("/popular")
    public List<AttractionResponse> getPopular(@RequestParam String city) {
        return attractionService.getPopularByCity(city);
    }

    @GetMapping("/{id}")
    public AttractionDetailResponse getAttraction(@PathVariable UUID id) {
        return attractionService.getAttractionById(id);
    }

    @PutMapping("/{id}")
    public AttractionDetailResponse updateAttraction(
            @PathVariable UUID id,
            @RequestBody AttractionUpdateRequest request) {
        return attractionService.updateAttraction(id, request);
    }

    @PostMapping
    public Attraction createAttraction(@RequestBody Attraction attraction) {
        return attractionService.create(attraction);
    }
}