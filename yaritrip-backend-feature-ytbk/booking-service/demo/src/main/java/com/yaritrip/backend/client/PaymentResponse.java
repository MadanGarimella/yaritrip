package com.yaritrip.backend.client;

import lombok.Data;

@Data
public class PaymentResponse {
    private String orderId;
    private String status;
}