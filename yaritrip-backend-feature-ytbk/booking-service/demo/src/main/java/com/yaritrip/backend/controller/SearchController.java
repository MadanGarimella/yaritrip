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

        @GetMapping("/cities")
        public List<City> getCities() {
                return cityRepository.findAll();
        }

        @GetMapping("/destinations")
        public List<City> getDestinations(@RequestParam UUID fromCityId) {
                return travelPackageRepository.findDestinationsByFromCity(fromCityId);
        }

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

                                        String toCity = pkg.getToCity().getName();

                                        List<String> images = imageService.getImagesForDestination(toCity);

                                        String imageUrl = (!images.isEmpty())
                                                        ? "http://localhost:8082" + images.get(0)
                                                        : null;

                                        double price = pkg.getPrice() != null ? pkg.getPrice() : 0;

                                        // ✅ FIXED ITINERARY (DTO)
                                        List<ItineraryDTO> itinerary = pkg.getItineraries() != null
                                                        ? pkg.getItineraries().stream().map(i -> ItineraryDTO.builder()
                                                                        .dayNumber(i.getDayNumber())
                                                                        .title(i.getTitle())
                                                                        .description(i.getDescription())
                                                                        .build()).collect(Collectors.toList())
                                                        : Collections.emptyList();

                                        // ✅ FIXED ACTIVITIES
                                        List<ActivityDTO> activities = pkg.getActivities() != null
                                                        ? pkg.getActivities().stream()
                                                                        .map(a -> new ActivityDTO(a.getName(),
                                                                                        a.getDescription()))
                                                                        .collect(Collectors.toList())
                                                        : Collections.emptyList();

                                        return PackageResponse.builder()
                                                        .id(pkg.getId())
                                                        .title("Premium " + toCity + " Deal")
                                                        .location(toCity)
                                                        .nights(pkg.getTotalDays())
                                                        .price(price)
                                                        .rating(pkg.getRating() != null ? pkg.getRating() : 4.5)
                                                        .image(imageUrl)
                                                        .images(images)
                                                        .itinerary(itinerary) // ✅ FIXED
                                                        .activities(activities) // ✅ FIXED
                                                        .build();
                                })

                                .sorted(Comparator.comparingDouble(PackageResponse::getPrice))
                                .collect(Collectors.toList());
        }
}