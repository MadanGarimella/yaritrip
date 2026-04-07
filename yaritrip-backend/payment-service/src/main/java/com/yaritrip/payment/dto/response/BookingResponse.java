package com.yaritrip.payment.client;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class BookingResponse {

    private UUID id;
    private UUID userId;
    private BigDecimal totalAmount;
}