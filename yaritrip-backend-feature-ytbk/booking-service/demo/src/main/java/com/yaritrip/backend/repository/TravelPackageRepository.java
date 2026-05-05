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

        // ================= DESTINATIONS =================
        @Query("""
                            SELECT DISTINCT p.toCity
                            FROM TravelPackage p
                            WHERE p.fromCity.id = :fromCityId
                        """)
        List<City> findDestinationsByFromCity(@Param("fromCityId") UUID fromCityId);

        // ================= SEARCH =================
        @Query("""
                            SELECT DISTINCT p FROM TravelPackage p
                            JOIN FETCH p.fromCity
                            JOIN FETCH p.toCity
                            WHERE LOWER(p.fromCity.name) LIKE LOWER(CONCAT('%', :from, '%'))
                            AND LOWER(p.toCity.name) LIKE LOWER(CONCAT('%', :to, '%'))
                            AND p.departureDate <= :selectedDate
                            AND p.totalRooms >= :rooms
                            AND (p.guestsPerRoom * :rooms) >= :guests
                        """)
        List<TravelPackage> searchByCityNames(
                        @Param("from") String from,
                        @Param("to") String to,
                        @Param("selectedDate") LocalDate selectedDate,
                        @Param("rooms") int rooms,
                        @Param("guests") int guests);

        // ================= SAFE FETCH (ONLY ONE COLLECTION) =================
        // 🔥 THIS FIXES YOUR 500 ERROR
        @Query("""
                            SELECT tp FROM TravelPackage tp
                            JOIN FETCH tp.fromCity
                            JOIN FETCH tp.toCity
                            LEFT JOIN FETCH tp.images
                            WHERE tp.id = :id
                        """)
        Optional<TravelPackage> findByIdWithImages(@Param("id") UUID id);

        // ================= FETCH WITH CITIES ONLY =================
        @Query("""
                            SELECT tp FROM TravelPackage tp
                            JOIN FETCH tp.fromCity
                            JOIN FETCH tp.toCity
                            WHERE tp.id = :id
                        """)
        Optional<TravelPackage> findByIdWithCities(@Param("id") UUID id);

        // ================= ADMIN LIST =================
        @Query("""
                            SELECT DISTINCT p FROM TravelPackage p
                            JOIN FETCH p.fromCity
                            JOIN FETCH p.toCity
                        """)
        List<TravelPackage> findAllWithCities();

        // ================= DASHBOARD =================
        long countByToCity(City city);
}