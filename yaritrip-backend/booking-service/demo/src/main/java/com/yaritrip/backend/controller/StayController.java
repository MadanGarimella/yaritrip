package com.yaritrip.backend.controller;

import com.yaritrip.backend.model.Stay;
import com.yaritrip.backend.service.StayService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

import java.util.List;

@RestController
@RequestMapping("/api/stays")
@RequiredArgsConstructor
public class StayController {

    private final StayService stayService;

    // Create stay
    @PostMapping
    public Stay createStay(@RequestBody Stay stay) {
        return stayService.createStay(stay);
    }

     @GetMapping("/{id}")
    public Stay getStayById(@PathVariable UUID id) {
        return stayService.getStayById(id);
    }

    // Get by region (North, South, etc.)
    @GetMapping
    public List<Stay> getStaysByRegion(
            @RequestParam String region
    ) {
        return stayService.getStaysByRegion(region.toUpperCase());
    }

    // Get premium stays only
    @GetMapping("/premium")
    public List<Stay> getPremiumStays(
            @RequestParam String region
    ) {
        return stayService.getPremiumStays(region.toUpperCase());
    }
}