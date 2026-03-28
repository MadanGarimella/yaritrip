package com.yaritrip.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import com.yaritrip.backend.service.WishlistService;
import org.springframework.security.core.Authentication;

import com.yaritrip.backend.model.TravelPackage;
import org.springframework.security.core.Authentication;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<?> getWishlist(Authentication authentication) {
        String email = authentication.getName();

        List<TravelPackage> wishlist = wishlistService.getWishlistByEmail(email);

        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/{packageId}")
    public ResponseEntity<?> add(@PathVariable UUID packageId,
            Authentication authentication) {

        String email = authentication.getName();

        wishlistService.addToWishlistByEmail(email, packageId);

        return ResponseEntity.ok("Added to wishlist");
    }

    @DeleteMapping("/{packageId}")
    public ResponseEntity<?> remove(@PathVariable UUID packageId,
            Authentication authentication) {

        String email = authentication.getName();

        wishlistService.removeFromWishlistByEmail(email, packageId);

        return ResponseEntity.ok("Removed");
    }

}