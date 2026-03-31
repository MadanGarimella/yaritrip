package com.yaritrip.payment.gateway;

import org.springframework.stereotype.Service;

@Service
public class RazorpayGateway implements PaymentGateway {

    @Override
    public GatewayResponse createOrder(Long amount, String currency, String receipt) {

        GatewayResponse response = new GatewayResponse();
        response.setOrderId("order_" + System.currentTimeMillis());
        response.setAmount(amount);
        response.setCurrency(currency);

        return response;
    }

    @Override
    public boolean verifyPayment(String orderId, String paymentId) {
        // Dummy verification for now
        return true;
    }
}