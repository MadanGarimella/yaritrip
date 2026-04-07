package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.Attraction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AttractionRepository extends JpaRepository<Attraction, UUID> {

    List<Attraction> findByIsPopularTrueAndLocationIgnoreCaseOrderByRatingDesc(String location);
    List<Attraction> findByLocationIgnoreCase(String location);

}
