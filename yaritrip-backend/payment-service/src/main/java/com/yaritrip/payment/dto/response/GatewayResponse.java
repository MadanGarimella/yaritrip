package com.yaritrip.payment.gateway;

import lombok.Data;

@Data
public class GatewayResponse {

    private String orderId;
    private Long amount;
    private String currency;
}