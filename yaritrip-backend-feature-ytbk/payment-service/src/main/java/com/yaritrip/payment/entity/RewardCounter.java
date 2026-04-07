package com.yaritrip.payment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reward_counter")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardCounter {

    @Id
    private Long id; // always = 1

    @Column(name = "total_rewards_given", nullable = false)
    private Integer totalRewardsGiven;
}