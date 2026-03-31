package com.yaritrip.payment.controller;

import com.yaritrip.payment.entity.Payment;
import com.yaritrip.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.yaritrip.payment.service.PaymentVerificationService;
import com.yaritrip.payment.service.PaymentSuccessHandler;

import java.util.UUID;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentVerificationService verificationService;
    private final PaymentSuccessHandler successHandler;

    @PostMapping("/initiate")
    public Payment initiate(@RequestParam UUID bookingId,
            @RequestParam UUID userId) {

        return paymentService.initiatePayment(bookingId, userId);
    }

    @PostMapping("/verify")
    public String verify(@RequestParam String orderId,
            @RequestParam String paymentId,
            @RequestParam String signature) {

        Payment payment = verificationService.verifyPayment(orderId, paymentId, signature);

        successHandler.handleSuccess(payment);

        return "Payment Verified";
    }
}