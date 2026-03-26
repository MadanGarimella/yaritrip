package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CityRepository extends JpaRepository<City, UUID> {
    Optional<City> findByCode(String code);
}