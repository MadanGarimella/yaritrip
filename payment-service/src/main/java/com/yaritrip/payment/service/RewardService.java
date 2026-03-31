package com.yaritrip.payment.service;

import com.yaritrip.payment.entity.Reward;
import com.yaritrip.payment.enums.RewardType;
import com.yaritrip.payment.repository.RewardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.yaritrip.payment.client.WalletClient;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final RewardCounterService rewardCounterService;
    private final WalletClient walletClient; // already in your structure

    private static final int DUBAI_LIMIT = 1200;

    public RewardType processReward(UUID userId, UUID paymentId) {

        long count = rewardCounterService.incrementAndGet();

        Reward reward = new Reward();
        reward.setUserId(userId);
        reward.setPaymentId(paymentId);

        if (count <= DUBAI_LIMIT) {
            reward.setRewardType(RewardType.DUBAI_TRIP);
        } else {
            reward.setRewardType(RewardType.WALLET);

            // 💰 Add wallet money
            walletClient.addMoney(userId, 5000);
        }

        rewardRepository.save(reward);

        return reward.getRewardType();
    }
}