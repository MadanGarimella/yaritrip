package com.yaritrip.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.yaritrip.backend.model.PackageImage;

import java.util.UUID;

public interface PackageImageRepository extends JpaRepository<PackageImage, UUID> {
}