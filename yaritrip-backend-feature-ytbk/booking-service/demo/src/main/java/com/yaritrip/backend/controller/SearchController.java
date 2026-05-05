package com.yaritrip.backend.controller;

import com.yaritrip.backend.model.City;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.CityRepository;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.dto.PackageResponse;
import com.yaritrip.backend.dto.ItineraryDTO;
import com.yaritrip.backend.dto.ActivityDTO;
import com.yaritrip.backend.service.PackageImageService;
import com.yaritrip.backend.service.TravelPackageService;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SearchController {

        private final CityRepository cityRepository;
        private final TravelPackageRepository travelPackageRepository;
        private final TravelPackageService service;
        private final PackageImageService imageService;

        // ✅ GET ALL CITIES
        @GetMapping("/cities")
        public List<City> getCities() {
                return cityRepository.findAll();
        }

        // ✅ GET DESTINATIONS
        @GetMapping("/destinations")
        public List<City> getDestinations(@RequestParam UUID fromCityId) {
                return travelPackageRepository.findDestinationsByFromCity(fromCityId);
        }

        // ✅ SEARCH PACKAGES
        @Transactional(readOnly = true)
        @GetMapping("/search")
        public List<PackageResponse> searchPackages(
                        @RequestParam String fromCode,
                        @RequestParam String toCode,
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                        @RequestParam int rooms,
                        @RequestParam int guests) {

                List<TravelPackage> packages = service.searchPackages(fromCode, toCode, date, rooms, guests);

                return packages.stream()

                                // ✅ REMOVE DUPLICATES
                                .collect(Collectors.toMap(
                                                TravelPackage::getId,
                                                pkg -> pkg,
                                                (existing, duplicate) -> existing))
                                .values()
                                .stream()

                                .map(pkg -> {

                                        String toCity = pkg.getToCity() != null
                                                        ? pkg.getToCity().getName()
                                                        : "Unknown";

                                        // SAFE IMAGE HANDLING
                                        List<String> images = Optional.ofNullable(
                                                        imageService.getImagesForDestination(toCity))
                                                        .orElse(Collections.emptyList());

                                        String imageUrl = !images.isEmpty()
                                                        ? "http://localhost:8082" + images.get(0)
                                                        : "";

                                        // SAFE PRICE
                                        double price = Optional.ofNullable(pkg.getPrice()).orElse(0.0);

                                        // FIXED NIGHTS LOGIC
                                        int nights = pkg.getTotalDays() != null
                                                        ? Math.max(pkg.getTotalDays() - 1, 0)
                                                        : 0;

                                        // ITINERARY FIX
                                        List<ItineraryDTO> itinerary = Optional.ofNullable(pkg.getItineraries())
                                                        .orElse(Collections.emptyList())
                                                        .stream()
                                                        .sorted(Comparator.comparingInt(i -> i.getDayNumber()))
                                                        .map(i -> ItineraryDTO.builder()
                                                                        .dayNumber(i.getDayNumber())
                                                                        .title("Day " + i.getDayNumber())
                                                                        .description(
                                                                                        i.getDescription() != null
                                                                                                        ? i.getDescription()
                                                                                                        : "Plan for Day "
                                                                                                                        + i.getDayNumber())
                                                                        .build())
                                                        .collect(Collectors.toList());

                                        // Activities
                                        List<ActivityDTO> activities = Optional.ofNullable(pkg.getActivities())
                                                        .orElse(Collections.emptyList())
                                                        .stream()
                                                        .map(a -> ActivityDTO.builder()
                                                                        .name(a.getName())
                                                                        .description(a.getDescription())
                                                                        .price(a.getPrice() != null ? a.getPrice()
                                                                                        : 0.0) 
                                                                        .build())
                                                        .collect(Collectors.toList());

                                        return PackageResponse.builder()
                                                        .id(pkg.getId())
                                                        .title("Premium " + toCity + " Deal")
                                                        .location(toCity)
                                                        .nights(nights) // ✅ FIXED
                                                        .price(price)
                                                        .rating(Optional.ofNullable(pkg.getRating()).orElse(4.5))
                                                        .image(imageUrl)
                                                        .images(images)
                                                        .overview(pkg.getOverview())
                                                        .itinerary(itinerary)
                                                        .activities(activities)
                                                        .build();
                                })
                                .sorted(Comparator.comparingDouble(PackageResponse::getPrice))//Sorting by price
                                .collect(Collectors.toList());
        }
}