package com.yaritrip.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import com.yaritrip.backend.repository.UserRepository;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.WishlistRepository;
import com.yaritrip.backend.model.Wishlist;
import com.yaritrip.backend.model.User;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final TravelPackageRepository travelPackageRepository;

    public void addToWishlist(UUID userId, UUID packageId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TravelPackage pkg = travelPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if (wishlistRepository.findByUserAndTravelPackage(user, pkg).isPresent()) {
            return; // already exists (idempotent)
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .travelPackage(pkg)
                .build();

        wishlistRepository.save(wishlist);
    }

    public void removeFromWishlist(UUID userId, UUID packageId) {
        User user = userRepository.findById(userId).orElseThrow();
        TravelPackage pkg = travelPackageRepository.findById(packageId).orElseThrow();

        wishlistRepository.deleteByUserAndTravelPackage(user, pkg);
    }

    public List<TravelPackage> getWishlistByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return wishlistRepository.findByUser(user)
                .stream()
                .map(Wishlist::getTravelPackage)
                .toList();
    }

    public void addToWishlistByEmail(String email, UUID packageId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TravelPackage pkg = travelPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if (wishlistRepository.findByUserAndTravelPackage(user, pkg).isPresent()) {
            return;
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .travelPackage(pkg)
                .build();

        wishlistRepository.save(wishlist);
    }

    public void removeFromWishlistByEmail(String email, UUID packageId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TravelPackage pkg = travelPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        wishlistRepository.deleteByUserAndTravelPackage(user, pkg);
    }
}