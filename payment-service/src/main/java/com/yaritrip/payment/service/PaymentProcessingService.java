package com.yaritrip.payment.service;

import com.yaritrip.payment.entity.Payment;
import com.yaritrip.payment.gateway.PaymentGateway;
import com.yaritrip.payment.gateway.GatewayResponse;
import com.yaritrip.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentProcessingService {

    private final PaymentGateway paymentGateway;
    private final PaymentRepository paymentRepository;

    public Payment createOrder(Payment payment) {

        // 🔒 Validation
        if (payment.getAmount() == null) {
            throw new RuntimeException("Payment amount cannot be null");
        }

        if (payment.getBookingId() == null) {
            throw new RuntimeException("Booking ID cannot be null");
        }

        // 💰 Convert ₹ → paise
        Long amountInPaise = payment.getAmount()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

        // 🔗 Call payment gateway
        GatewayResponse response = paymentGateway.createOrder(
                amountInPaise,
                "INR",
                payment.getBookingId().toString()
        );

        // 🔄 Update payment entity
        payment.setGatewayOrderId(response.getOrderId());

        // 💾 Persist changes
        return paymentRepository.save(payment);
    }
}