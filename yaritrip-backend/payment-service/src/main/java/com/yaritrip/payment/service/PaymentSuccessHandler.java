package com.yaritrip.payment.service;

import com.yaritrip.payment.entity.Payment;
import com.yaritrip.payment.enums.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.yaritrip.payment.client.BookingClient;

@Service
@RequiredArgsConstructor
public class PaymentSuccessHandler {

    private final BookingClient bookingClient;
    private final RewardService rewardService;
    // private final PaymentLoggingService loggingService;

    public void handleSuccess(Payment payment) {

        if (payment.getStatus() == PaymentStatus.SUCCESS) {

            // 🔹 Prevent duplicate execution
            if (payment.getGatewayPaymentId() == null) return;

            // 🔹 Confirm booking
            bookingClient.confirmBooking(payment.getBookingId());

            // 🔹 Process reward
            rewardService.processReward(
                    payment.getUserId(),
                    payment.getId()
            );

            // // 🔹 Log success
            // loggingService.logTransaction(
            //         payment.getId(),
            //         "SUCCESS",
            //         null,
            //         null,
            //         "COMPLETED"
            // );
        }
    }
}