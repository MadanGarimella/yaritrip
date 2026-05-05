package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface ItineraryRepository extends JpaRepository<Itinerary, UUID> {

    List<Itinerary> findByTravelPackageId(UUID packageId);

}