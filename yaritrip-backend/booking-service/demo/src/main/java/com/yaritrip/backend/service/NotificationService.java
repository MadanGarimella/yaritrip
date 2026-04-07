package com.yaritrip.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationService {

    @Async("authTaskExecutor")
    public void sendWelcome(String email, String name) {
        log.info("Sending welcome email to {}", email);

        // 🔥 Replace with real email/SMS later
        System.out.println("Welcome " + name + "! 🎉");
    }

    @Async("authTaskExecutor")
    public void sendLoginAlert(String email) {
        log.info("Login alert for {}", email);

        // 🔥 Replace with SMS/email later
        System.out.println("Login detected for " + email);
    }

    @Async("authTaskExecutor")
    public void sendBookingConfirmation(String email, String bookingId) {
        System.out.println("Booking confirmed for " + email + " | Booking ID: " + bookingId);
    }
}