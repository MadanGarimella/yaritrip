package com.yaritrip.backend.client;

import lombok.Data;

@Data
public class PaymentRequest {
    private String bookingId;
    private double amount;
    private String currency = "INR";
}