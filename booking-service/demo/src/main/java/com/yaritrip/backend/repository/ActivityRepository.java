package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ActivityRepository extends JpaRepository<Activity, UUID> {
}