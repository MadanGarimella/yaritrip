package com.yaritrip.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.yaritrip.backend.model.User;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.model.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {

    List<Wishlist> findByUser(User user);

    Optional<Wishlist> findByUserAndTravelPackage(User user, TravelPackage travelPackage);

    void deleteByUserAndTravelPackage(User user, TravelPackage travelPackage);
}