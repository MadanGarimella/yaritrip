package com.yaritrip.backend.controller;

import com.yaritrip.backend.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    // 🔥 GET BALANCE
    @GetMapping
    public int getBalance(Authentication authentication) {
        return walletService.getBalance(authentication.getName());
    }

    // 🔥 SUBSCRIPTION
    @PostMapping("/subscribe")
    public String subscribe(Authentication authentication) {
        walletService.applySubscription(authentication.getName());
        return "Subscription applied";
    }

    // 🔥 BOOKING REWARD
    @PostMapping("/reward")
    public String reward(Authentication authentication) {
        walletService.rewardBooking(authentication.getName());
        return "Reward added";
    }
}