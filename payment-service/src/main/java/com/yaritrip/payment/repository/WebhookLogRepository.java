package com.yaritrip.payment.repository;

import com.yaritrip.payment.entity.WebhookLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WebhookLogRepository extends JpaRepository<WebhookLog, UUID> {
}