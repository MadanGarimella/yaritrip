package com.yaritrip.payment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RewardCounterService {

    private static final String REWARD_COUNTER_KEY = "reward:counter";

    private final StringRedisTemplate redisTemplate;

    public long incrementAndGet() {

        Long value = redisTemplate.opsForValue().increment(REWARD_COUNTER_KEY);

        if (value == null) {
            throw new RuntimeException("Redis increment failed");
        }

        return value;
    }

    public long getCurrentCount() {
        String value = redisTemplate.opsForValue().get(REWARD_COUNTER_KEY);
        return value == null ? 0 : Long.parseLong(value);
    }
}