package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByStatus(String status);

    List<Booking> findAllByOrderByIdDesc();
}