package com.yaritrip.backend.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Component
public class PaymentClient {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String PAYMENT_URL = "http://localhost:8090/api/payments/create-order";

    public PaymentResponse createOrder(PaymentRequest request) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PaymentRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<PaymentResponse> response = restTemplate.exchange(
                PAYMENT_URL,
                HttpMethod.POST,
                entity,
                PaymentResponse.class);

        return response.getBody();
    }

    public Double getTotalRevenue() {

        String url = "http://localhost:8090/api/payments/revenue";

        ResponseEntity<Double> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                Double.class);

        return response.getBody();
    }
}