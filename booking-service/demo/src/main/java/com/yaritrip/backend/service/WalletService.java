package com.yaritrip.backend.service;

import com.yaritrip.backend.model.*;
import com.yaritrip.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    private static final int REGISTER_BONUS = 500;
    private static final int SUBSCRIPTION_BONUS = 5000;
    private static final int BOOKING_REWARD = 1500;

    // 🔥 CREATE WALLET ON REGISTER
    public Wallet getOrCreateWallet(User user) {

        return walletRepository.findByUser(user)
                .orElseGet(() -> {

                    Wallet wallet = Wallet.builder()
                            .user(user)
                            .balance(REGISTER_BONUS)
                            .build();

                    Wallet saved = walletRepository.save(wallet);

                    saveTransaction(saved, REGISTER_BONUS, "REGISTER_BONUS");

                    return saved;
                });
    }

    // 🔥 ADD CREDITS
    public void addCredits(String email, int amount, String type) {

        User user = userRepository.findByEmail(email).orElseThrow();
        Wallet wallet = walletRepository.findByUser(user).orElseThrow();

        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);

        saveTransaction(wallet, amount, type);
    }

    // 🔥 SUBSCRIPTION
    public void applySubscription(String email) {
        addCredits(email, SUBSCRIPTION_BONUS, "SUBSCRIPTION");
    }

    // 🔥 BOOKING REWARD
    public void rewardBooking(String email) {
        addCredits(email, BOOKING_REWARD, "BOOKING_REWARD");
    }

    // 🔥 GET BALANCE
    public int getBalance(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Wallet wallet = getOrCreateWallet(user);
        return wallet.getBalance();
    }

    // 🔥 SAVE TRANSACTION
    private void saveTransaction(Wallet wallet, int amount, String type) {

        WalletTransaction tx = WalletTransaction.builder()
                .wallet(wallet)
                .amount(amount)
                .type(type)
                .createdAt(LocalDateTime.now())
                .build();

        transactionRepository.save(tx);
    }
}