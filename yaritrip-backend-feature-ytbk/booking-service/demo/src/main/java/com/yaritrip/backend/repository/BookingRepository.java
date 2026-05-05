package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.Booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

        @Transactional
        @Modifying
        @Query("UPDATE Booking b SET b.user = NULL WHERE b.user.id = :userId")
        void removeUserReference(UUID userId);

        long countByTravelPackage_Id(UUID packageId);

        long countByUserId(UUID userId);

        List<Booking> findByStatus(String status);

        List<Booking> findTop5ByOrderByDateDesc();

        List<Booking> findAllByOrderByDateDesc();

        @Query("""
                            SELECT b FROM Booking b
                            JOIN FETCH b.user
                            JOIN FETCH b.travelPackage tp
                            JOIN FETCH tp.fromCity
                            JOIN FETCH tp.toCity
                            ORDER BY b.date DESC
                        """)
        List<Booking> findAllWithDetails();

        @Query("""
                            SELECT b FROM Booking b
                            JOIN FETCH b.user
                            JOIN FETCH b.travelPackage tp
                            JOIN FETCH tp.fromCity
                            JOIN FETCH tp.toCity
                            ORDER BY b.date DESC
                        """)
        List<Booking> findTop5WithDetails();

        @Query(value = """
                                SELECT EXTRACT(MONTH FROM b.created_at) as month,
                                       SUM(b.total_amount) as revenue
                                FROM bookings b
                                GROUP BY EXTRACT(MONTH FROM b.created_at)
                                ORDER BY month
                        """, nativeQuery = true)
        List<Object[]> getMonthlyRevenue();

        @Query(value = """
                                SELECT c.name as destination, COUNT(*) as count
                                FROM bookings b
                                JOIN travel_package tp ON b.package_id = tp.id
                                JOIN city c ON tp.to_city_id = c.id
                                GROUP BY c.name
                        """, nativeQuery = true)
        List<Object[]> getBookingsByDestination();

        @Query("""
                            SELECT b.travelPackage.id, COUNT(b)
                            FROM Booking b
                            GROUP BY b.travelPackage.id
                        """)
        List<Object[]> countBookingsGroupedByPackage();
}