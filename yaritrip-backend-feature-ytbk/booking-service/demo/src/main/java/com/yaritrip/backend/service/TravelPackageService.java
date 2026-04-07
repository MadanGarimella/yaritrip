package com.yaritrip.backend.service;

import com.yaritrip.backend.model.Activity;
import com.yaritrip.backend.model.City;
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
}