package com.yaritrip.payment.service;

import com.yaritrip.payment.client.BookingClient;
import com.yaritrip.payment.client.BookingResponse;
import com.yaritrip.payment.entity.Payment;
import com.yaritrip.payment.enums.GatewayType;
import com.yaritrip.payment.enums.PaymentStatus;
import com.yaritrip.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingClient bookingClient;
    private final IdempotencyService idempotencyService;
    private final PaymentProcessingService paymentProcessingService;

    public Payment initiatePayment(UUID bookingId, UUID userId) {

        // 🔴 Step 1: Fetch booking
        BookingResponse booking = bookingClient.getBooking(bookingId);

        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }

        // 🔴 Step 2: Validate ownership
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        // 🔴 Step 3: Idempotency key
        String key = idempotencyService.generateKey(
                bookingId.toString(),
                userId.toString()
        );

        Optional<Payment> existing = idempotencyService.checkExisting(key);

        if (existing.isPresent()) {
            return existing.get(); // prevent duplicate payment
        }

        // 🔴 Step 4: Create payment
        Payment payment = Payment.builder()
                .bookingId(bookingId)
                .userId(userId)
                .amount(booking.getTotalAmount())
                .currency("INR")
                .status(PaymentStatus.PENDING)
                .gateway(GatewayType.RAZORPAY)
                .idempotencyKey(key)
                .build();

        paymentRepository.save(payment);

        // 🔴 Step 5: Call gateway
        paymentProcessingService.createOrder(payment);

        return payment;
    }
}