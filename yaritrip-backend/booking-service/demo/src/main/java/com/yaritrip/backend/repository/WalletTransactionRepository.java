package com.yaritrip.backend.repository;

import com.yaritrip.backend.model.WalletTransaction;
import com.yaritrip.backend.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, UUID> {

    List<WalletTransaction> findByWallet(Wallet wallet);
}