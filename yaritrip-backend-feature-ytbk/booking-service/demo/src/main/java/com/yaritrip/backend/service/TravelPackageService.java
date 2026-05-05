package com.yaritrip.backend.service;

import com.yaritrip.backend.dto.ActivityDTO;
import com.yaritrip.backend.dto.CreatePackageRequest;
import com.yaritrip.backend.dto.ItineraryDTO;
import com.yaritrip.backend.dto.UpdatePackageRequest;
import com.yaritrip.backend.model.Activity;
import com.yaritrip.backend.model.City;
import com.yaritrip.backend.model.Itinerary;
import com.yaritrip.backend.model.PackageImage;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.ActivityRepository;
import com.yaritrip.backend.repository.CityRepository;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.repository.PackageImageRepository;
import com.yaritrip.backend.repository.ItineraryRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TravelPackageService {

        private final TravelPackageRepository travelPackageRepository;
        private final CityRepository cityRepository;
        private final ActivityRepository activityRepository;
        private final PackageImageRepository packageImageRepository;
        private final ItineraryRepository itineraryRepository;

        // private final ItineraryRepository itineraryRepository;
        // ===========================
        // 🔥 CREATE PACKAGE
        // ===========================
        @Transactional
        public TravelPackage createPackage(CreatePackageRequest request) {

                // ✅ CREATE / FIND CITY
                City toCity = cityRepository.findByNameIgnoreCase(request.getLocation())
                                .orElseGet(() -> {
                                        City newCity = City.builder()
                                                        .name(request.getLocation())
                                                        .code(request.getLocation().substring(0, 3).toUpperCase())
                                                        .country("India")
                                                        .build();
                                        return cityRepository.save(newCity);
                                });

                // ✅ DEFAULT FROM CITY (TEMP FIX)
                City fromCity = cityRepository.findByNameIgnoreCase("Hyderabad")
                                .orElseThrow(() -> new RuntimeException("Default city not found"));

                // ✅ BUILD PACKAGE
                TravelPackage pkg = TravelPackage.builder()
                                .fromCity(fromCity)
                                .toCity(toCity)

                                // 🔥 REQUIRED FIXES
                                .departureDate(LocalDate.now().plusDays(2))
                                .totalRooms(10)
                                .guestsPerRoom(2)

                                .totalDays(request.getTotalDays())
                                .category(request.getCategory())
                                .overview(request.getOverview())
                                .price(request.getPrice())
                                .rating(4.5)
                                .bannerImageUrl(
                                                request.getImages() != null && !request.getImages().isEmpty()
                                                                ? request.getImages().get(0)
                                                                : null)
                                .build();

                TravelPackage saved = travelPackageRepository.save(pkg);

                // ✅ SAVE IMAGES
                if (request.getImages() != null) {
                        List<PackageImage> images = request.getImages().stream()
                                        .map(img -> PackageImage.builder()
                                                        .imageUrl(img)
                                                        .travelPackage(saved)
                                                        .build())
                                        .toList();

                        packageImageRepository.saveAll(images);
                }

                // ✅ SAVE ITINERARY
                if (request.getItinerary() != null) {
                        List<Itinerary> itineraryList = request.getItinerary().stream()
                                        .map(i -> Itinerary.builder()
                                                        .dayNumber(i.getDayNumber())
                                                        .title(i.getTitle())
                                                        .description(i.getDescription())
                                                        .travelPackage(saved)
                                                        .build())
                                        .toList();

                        itineraryRepository.saveAll(itineraryList);
                }

                // ✅ SAVE ACTIVITIES
                if (request.getActivities() != null) {
                        List<Activity> activityList = request.getActivities().stream()
                                        .map(a -> Activity.builder()
                                                        .name(a.getName())
                                                        .description(a.getDescription())
                                                        .price(a.getPrice())
                                                        .travelPackage(saved)
                                                        .build())
                                        .toList();

                        activityRepository.saveAll(activityList);
                }

                return saved;
        }

        // ===========================
        // 🔥 UPDATE PACKAGE (FULL SYNC FIX)
        // ===========================
        @Transactional
        public TravelPackage updatePackage(UUID id, UpdatePackageRequest req) {

                TravelPackage pkg = travelPackageRepository.findByIdWithImages(id)
                                .orElseThrow(() -> new RuntimeException("Package not found"));

                pkg.setPrice(req.getPrice());
                pkg.setTotalDays(req.getTotalDays());
                pkg.setCategory(req.getCategory());
                pkg.setOverview(req.getOverview());
                pkg.setRating(req.getRating());

                // ITINERARY RESET
                pkg.getItineraries().clear();

                if (req.getItinerary() != null) {
                        for (ItineraryDTO dto : req.getItinerary()) {
                                Itinerary it = new Itinerary();
                                it.setDayNumber(dto.getDayNumber());
                                it.setTitle(dto.getTitle());
                                it.setDescription(dto.getDescription());
                                it.setTravelPackage(pkg);
                                pkg.getItineraries().add(it);
                        }
                }

                // ACTIVITIES RESET
                pkg.getActivities().clear();

                if (req.getActivities() != null) {
                        for (ActivityDTO dto : req.getActivities()) {
                                Activity act = new Activity();
                                act.setName(dto.getName());
                                act.setDescription(dto.getDescription());
                                act.setPrice(dto.getPrice());
                                act.setTravelPackage(pkg);
                                pkg.getActivities().add(act);
                        }
                }

                return travelPackageRepository.save(pkg);
        }

        // ===========================
        // 🔥 SEARCH (FIXED)
        // ===========================
        public List<TravelPackage> searchPackages(
                        String from,
                        String to,
                        LocalDate date,
                        int rooms,
                        int guests) {

                return travelPackageRepository.searchByCityNames(
                                from,
                                to,
                                date,
                                rooms,
                                guests);
        }

        // ===========================
        // IMAGE UPLOAD
        // ===========================
        public String uploadImage(UUID id, MultipartFile file) {
                try {

                        TravelPackage pkg = travelPackageRepository.findById(id)
                                        .orElseThrow(() -> new RuntimeException("Package not found"));

                        String uploadDir = "uploads/";
                        File dir = new File(uploadDir);
                        if (!dir.exists())
                                dir.mkdirs();

                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        Path path = Paths.get(uploadDir + fileName);

                        Files.write(path, file.getBytes());

                        String url = "/uploads/" + fileName;

                        PackageImage img = PackageImage.builder()
                                        .imageUrl(url)
                                        .travelPackage(pkg)
                                        .build();

                        if (pkg.getImages() == null) {
                                pkg.setImages(new ArrayList<>());
                        }

                        pkg.getImages().add(img);

                        if (pkg.getImages().size() == 1) {
                                pkg.setBannerImageUrl(url);
                        }

                        travelPackageRepository.save(pkg);

                        return url;

                } catch (Exception e) {
                        throw new RuntimeException("Image upload failed", e);
                }
        }

        // ===========================
        // 🔥 AUTO CITY CREATION
        // ===========================
        private City getOrCreateCity(String name) {

                return cityRepository.findByNameIgnoreCase(name)
                                .orElseGet(() -> {
                                        City city = new City();

                                        city.setName(name);

                                        String code = name.substring(0, Math.min(3, name.length())).toUpperCase();
                                        city.setCode(code);

                                        city.setCountry("India");

                                        return cityRepository.save(city);
                                });
        }
}