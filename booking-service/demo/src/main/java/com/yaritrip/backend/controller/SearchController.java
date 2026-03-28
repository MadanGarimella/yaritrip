package com.yaritrip.backend.controller;

import com.yaritrip.backend.model.City;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.CityRepository;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.dto.PackageResponse;
import com.yaritrip.backend.service.PackageImageService;
import com.yaritrip.backend.service.TravelPackageService;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SearchController {

    private final CityRepository cityRepository;
    private final TravelPackageRepository travelPackageRepository;
    private final TravelPackageService service;
    private final PackageImageService imageService;

    // 1️⃣ Get all cities (From City dropdown)
    @GetMapping("/cities")
    public List<City> getCities() {
        return cityRepository.findAll();
    }

    // 2️⃣ Get destinations based on selected fromCity
    @GetMapping("/destinations")
    public List<City> getDestinations(@RequestParam UUID fromCityId) {
        return travelPackageRepository.findDestinationsByFromCity(fromCityId);
    }

    // 3️⃣ Search packages
    @GetMapping("/search")
    public List<PackageResponse> searchPackages(
            @RequestParam String fromCode,
            @RequestParam String toCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam int rooms,
            @RequestParam int guests) {

        List<TravelPackage> packages =
                service.searchPackages(fromCode, toCode, date.toString(), rooms, guests);

        return packages.stream().map(pkg -> {

            List<String> images =
                    imageService.getImagesForDestination(pkg.getToCity().getName());

            return PackageResponse.builder()
                    .id(pkg.getId())
                    .title(pkg.getFromCity().getName() + " to " + pkg.getToCity().getName())
                    .location(pkg.getToCity().getName())
                    .nights(pkg.getTotalDays())
                    .price(pkg.getPrice())
                    .rating(pkg.getRating() != null ? pkg.getRating() : 4.5)
                    .image("http://localhost:8082" + images.get(0))
                    // .image("http://192.168.1.11:8082" + images.get(0))
                    .images(images)
                    .build();

        }).toList();
    }
}