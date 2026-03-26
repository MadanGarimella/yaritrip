package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.TravelPackage;

import com.yaritrip.backend.model.City;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TravelPackageRepository extends JpaRepository<TravelPackage, UUID> {

    @Query("""
                SELECT DISTINCT p.toCity
                FROM TravelPackage p
                WHERE p.fromCity.id = :fromCityId
            """)
    List<City> findDestinationsByFromCity(UUID fromCityId);

    @Query("""
                SELECT p FROM TravelPackage p
                WHERE p.fromCity.id = :fromCity
                AND p.toCity.id = :destination
                AND p.departureDate >= :date
                AND p.totalRooms >= :rooms
                AND (p.guestsPerRoom * :rooms) >= :guests
            """)
    List<TravelPackage> searchPackages(
            @Param("fromCity") UUID fromCity,
            @Param("destination") UUID destination,
            @Param("date") LocalDate date,
            @Param("rooms") int rooms,
            @Param("guests") int guests);

    @Query("""
                SELECT tp FROM TravelPackage tp
                LEFT JOIN FETCH tp.images
                WHERE tp.id = :id
            """)
    Optional<TravelPackage> findByIdWithImages(@Param("id") UUID id);
}