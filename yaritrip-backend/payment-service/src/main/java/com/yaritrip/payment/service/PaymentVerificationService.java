package com.yaritrip.payment.service;

import com.yaritrip.payment.entity.Payment;
import com.yaritrip.payment.enums.PaymentStatus;
import com.yaritrip.payment.repository.PaymentRepository;
import com.yaritrip.payment.util.SignatureUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentVerificationService {

    private final PaymentRepository paymentRepository;

    @Value("${razorpay.secret}")
    private String secret;

    public Payment verifyPayment(String orderId,
                                 String paymentId,
                                 String signature) {

        String payload = orderId + "|" + paymentId;

        String generatedSignature =
                SignatureUtil.generateHmacSHA256(payload, secret);

        if (!generatedSignature.equals(signature)) {
            throw new RuntimeException("Invalid payment signature");
        }

        Payment payment = paymentRepository
                .findByGatewayOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setGatewayPaymentId(paymentId);
        payment.setGatewaySignature(signature);
        payment.setStatus(PaymentStatus.SUCCESS);

        return paymentRepository.save(payment);
    }
}