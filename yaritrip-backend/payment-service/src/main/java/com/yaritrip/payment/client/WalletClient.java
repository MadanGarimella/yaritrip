package com.yaritrip.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@FeignClient(name = "wallet-service", url = "${services.wallet.url}")
public interface WalletClient {

    @PostMapping("/wallet/add")
    void addMoney(@RequestParam UUID userId,
                  @RequestParam int amount);
}