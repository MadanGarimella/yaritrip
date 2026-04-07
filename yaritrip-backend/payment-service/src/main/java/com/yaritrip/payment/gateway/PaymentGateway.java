package com.yaritrip.payment.gateway;

public interface PaymentGateway {

    GatewayResponse createOrder(Long amount, String currency, String receipt);

    boolean verifyPayment(String orderId, String paymentId);
}