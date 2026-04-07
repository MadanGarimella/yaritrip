package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.AttractionPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface AttractionPackageRepository extends JpaRepository<AttractionPackage, UUID> {

    @Query("""
                SELECT ap.id
                FROM AttractionPackage ap
                JOIN ap.attractions a
                WHERE a.id = :attractionId
            """)
    List<UUID> findPackageIdsByAttraction(@Param("attractionId") UUID attractionId);

    @Query("""
                SELECT ap FROM AttractionPackage ap
                JOIN ap.attractions a
                WHERE a.id = :attractionId
            """)
    List<AttractionPackage> findAllByAttractionId(UUID attractionId);
}