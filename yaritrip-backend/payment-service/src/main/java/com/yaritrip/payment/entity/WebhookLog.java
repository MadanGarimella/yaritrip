package com.yaritrip.payment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "webhook_logs",
       indexes = {
           @Index(name = "idx_gateway", columnList = "gateway"),
           @Index(name = "idx_processed_at", columnList = "processed_at")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookLog {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String gateway; // RAZORPAY / STRIPE

    @Column(columnDefinition = "TEXT", nullable = false)
    private String payload;

    @Column
    private String signature;

    @Column(name = "verification_status")
    private String verificationStatus; // VERIFIED / FAILED

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @PrePersist
    public void prePersist() {
        this.processedAt = LocalDateTime.now();
    }
}