package com.yaritrip.payment.repository;

import com.yaritrip.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByBookingId(UUID bookingId);

    Optional<Payment> findByIdempotencyKey(String idempotencyKey);

    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);

}