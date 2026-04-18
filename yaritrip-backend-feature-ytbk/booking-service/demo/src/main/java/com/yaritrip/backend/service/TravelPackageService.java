package com.yaritrip.backend.service;

import com.yaritrip.backend.dto.ActivityDTO;
import com.yaritrip.backend.dto.CreatePackageRequest;
import com.yaritrip.backend.dto.ItineraryDTO;
import com.yaritrip.backend.dto.UpdatePackageRequest;
import com.yaritrip.backend.model.Activity;
import com.yaritrip.backend.model.City;
import com.yaritrip.backend.model.Itinerary;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.ActivityRepository;
import com.yaritrip.backend.repository.CityRepository;
import com.yaritrip.backend.repository.TravelPackageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TravelPackageService {

        private final TravelPackageRepository travelPackageRepository;
        private final CityRepository cityRepository;
        private final ActivityRepository activityRepository;

        public TravelPackage create(
                        UUID fromCityId,
                        UUID destinationCityId,
                        LocalDate departureDate,
                        int totalRooms,
                        int guestsPerRoom) {

                City fromCity = cityRepository.findById(fromCityId)
                                .orElseThrow(() -> new RuntimeException("From city not found"));

                City destinationCity = cityRepository.findById(destinationCityId)
                                .orElseThrow(() -> new RuntimeException("Destination city not found"));

                TravelPackage pkg = TravelPackage.builder()
                                .fromCity(fromCity)
                                .toCity(destinationCity)
                                .departureDate(departureDate)
                                .totalRooms(totalRooms)
                                .guestsPerRoom(guestsPerRoom)
                                .build();

                return travelPackageRepository.save(pkg);
        }

        @Transactional
        public TravelPackage getPackageById(UUID id) {
                return travelPackageRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Package not found"));
        }

        @Transactional
        public List<TravelPackage> searchPackages(
                        String fromCode,
                        String toCode,
                        LocalDate selectedDate,
                        int rooms,
                        int guests) {

                City fromCity = cityRepository.findByCode(fromCode)
                                .orElseThrow(() -> new RuntimeException("From city not found"));

                City toCity = cityRepository.findByCode(toCode)
                                .orElseThrow(() -> new RuntimeException("Destination city not found"));

                return travelPackageRepository.searchPackages(
                                fromCity.getId(),
                                toCity.getId(),
                                selectedDate,
                                rooms,
                                guests);
        }

        @Transactional
        public TravelPackage updatePackage(UUID id, UpdatePackageRequest request) {

                TravelPackage existing = travelPackageRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Package not found"));

                if (request.getPrice() != null)
                        existing.setPrice(request.getPrice());

                if (request.getTotalDays() != null)
                        existing.setTotalDays(request.getTotalDays());

                if (request.getCategory() != null)
                        existing.setCategory(request.getCategory());

                // ✅ CORRECT METHOD NAME (IMPORTANT)
                if (existing.getItineraries() == null) {
                        existing.setItineraries(new java.util.ArrayList<>());
                }

                if (existing.getActivities() == null) {
                        existing.setActivities(new java.util.ArrayList<>());
                }

                // 🔥 ITINERARY FIX
                if (request.getItinerary() != null) {

                        existing.getItineraries().clear();

                        for (ItineraryDTO dto : request.getItinerary()) {

                                Itinerary day = new Itinerary();
                                day.setDayNumber(dto.getDayNumber());
                                day.setDescription(dto.getDescription());
                                day.setTravelPackage(existing);

                                existing.getItineraries().add(day);
                        }
                }

                // 🔥 ACTIVITY FIX
                if (request.getActivities() != null) {

                        existing.getActivities().clear();

                        for (ActivityDTO dto : request.getActivities()) {

                                Activity act = new Activity();
                                act.setName(dto.getName());
                                act.setTravelPackage(existing);

                                existing.getActivities().add(act);
                        }
                }

                return travelPackageRepository.save(existing);
        }

        @Transactional
        public TravelPackage createPackage(CreatePackageRequest req) {

                City fromCity = cityRepository.findById(req.getFromCityId())
                                .orElseThrow(() -> new RuntimeException("From city not found"));

                City toCity = cityRepository.findById(req.getToCityId())
                                .orElseThrow(() -> new RuntimeException("To city not found"));

                TravelPackage pkg = TravelPackage.builder()
                                .fromCity(fromCity)
                                .toCity(toCity)
                                .departureDate(LocalDate.parse(req.getDepartureDate()))
                                .totalRooms(req.getTotalRooms())
                                .guestsPerRoom(req.getGuestsPerRoom())
                                .totalDays(req.getTotalDays())
                                .category(req.getCategory())
                                .overview(req.getOverview())
                                .price(req.getPrice())
                                .build();

                // 🔥 HANDLE IMAGES (TEMP)
                if (req.getImages() != null && !req.getImages().isEmpty()) {
                        pkg.setBannerImageUrl(req.getImages().get(0)); // first image
                }

                return travelPackageRepository.save(pkg);
        }
}