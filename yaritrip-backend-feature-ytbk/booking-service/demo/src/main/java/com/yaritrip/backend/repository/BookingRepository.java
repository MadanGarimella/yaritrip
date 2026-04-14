package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    @Modifying
    @Query("UPDATE Booking b SET b.user = NULL WHERE b.user.id = :userId")
    void removeUserReference(UUID userId);

    List<Booking> findByStatus(String status);

    List<Booking> findAllByOrderByDateDesc();

    @Query("""
                SELECT EXTRACT(MONTH FROM b.date) as month, SUM(b.totalAmount) as revenue
                FROM Booking b
                GROUP BY EXTRACT(MONTH FROM b.date)
                ORDER BY month
            """)
    List<Object[]> getMonthlyRevenue();

    @Query("""
                SELECT tp.toCity.name as destination, COUNT(b) as count
                FROM Booking b
                JOIN TravelPackage tp ON b.packageId = tp.id
                GROUP BY tp.toCity.name
            """)
    List<Map<String, Object>> getBookingsByDestination();

    List<Booking> findTop5ByOrderByDateDesc();

    long countByUserId(UUID userId);
}
