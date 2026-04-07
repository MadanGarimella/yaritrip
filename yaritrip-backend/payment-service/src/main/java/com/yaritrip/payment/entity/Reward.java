package com.yaritrip.payment.entity;

import com.yaritrip.payment.enums.RewardType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "rewards",
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_user_payment_reward", columnNames = {"user_id", "payment_id"})
       },
       indexes = {
           @Index(name = "idx_user_id", columnList = "user_id"),
           @Index(name = "idx_reward_type", columnList = "reward_type")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reward {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "payment_id", nullable = false)
    private UUID paymentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "reward_type", nullable = false)
    private RewardType rewardType; // DUBAI_TRIP / WALLET

    @Column(name = "claimed", nullable = false)
    private boolean claimed;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.claimed = false;
    }
}