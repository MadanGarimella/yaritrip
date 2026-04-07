package com.yaritrip.payment.repository;

import com.yaritrip.payment.entity.Reward;
import com.yaritrip.payment.enums.RewardType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RewardRepository extends JpaRepository<Reward, UUID> {

    Optional<Reward> findByPaymentId(UUID paymentId);

    Optional<Reward> findByUserIdAndRewardType(UUID userId, RewardType rewardType);

}