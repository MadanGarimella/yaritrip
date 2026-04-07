package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.model.City;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TravelPackageRepository extends JpaRepository<TravelPackage, UUID> {

    // ✅ 1. DESTINATIONS
    @Query("""
                SELECT DISTINCT p.toCity
                FROM TravelPackage p
                WHERE p.fromCity.id = :fromCityId
            """)
    List<City> findDestinationsByFromCity(@Param("fromCityId") UUID fromCityId);

    // ✅ 2. SEARCH (SAFE - NO MULTIPLE BAG FETCH)
    @Query("""
                SELECT DISTINCT p FROM TravelPackage p
                JOIN FETCH p.fromCity
                JOIN FETCH p.toCity
                WHERE p.fromCity.id = :fromId
                AND p.toCity.id = :toId
                AND p.departureDate <= :selectedDate
                AND p.totalRooms >= :rooms
                AND (p.guestsPerRoom * :rooms) >= :guests
            """)
    List<TravelPackage> searchPackages(
            @Param("fromId") UUID fromId,
            @Param("toId") UUID toId,
            @Param("selectedDate") LocalDate selectedDate,
            @Param("rooms") int rooms,
            @Param("guests") int guests);

    // ✅ 3. FETCH IMAGES ONLY
    @Query("""
                SELECT tp FROM TravelPackage tp
                LEFT JOIN FETCH tp.images
                WHERE tp.id = :id
            """)
    Optional<TravelPackage> findByIdWithImages(@Param("id") UUID id);

    Optional<TravelPackage> findById(UUID id);
}