package com.yaritrip.payment.repository;

import com.yaritrip.payment.entity.RewardCounter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RewardCounterRepository extends JpaRepository<RewardCounter, Long> {
}