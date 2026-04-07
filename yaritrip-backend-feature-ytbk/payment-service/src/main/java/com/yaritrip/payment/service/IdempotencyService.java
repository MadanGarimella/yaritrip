package com.yaritrip.payment.service;

import com.yaritrip.payment.entity.Payment;
import com.yaritrip.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IdempotencyService {

    private final PaymentRepository paymentRepository;

    public Optional<Payment> checkExisting(String idempotencyKey) {
        return paymentRepository.findByIdempotencyKey(idempotencyKey);
    }

    public String generateKey(String bookingId, String userId) {
        return bookingId + "_" + userId;
    }
}
