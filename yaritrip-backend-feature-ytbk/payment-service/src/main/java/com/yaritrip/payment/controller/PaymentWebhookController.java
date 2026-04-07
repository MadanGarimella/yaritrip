package com.yaritrip.payment.webhook;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yaritrip.payment.entity.Payment;
import com.yaritrip.payment.entity.WebhookLog;
import com.yaritrip.payment.repository.PaymentRepository;
import com.yaritrip.payment.repository.WebhookLogRepository;
import com.yaritrip.payment.service.PaymentSuccessHandler;
import com.yaritrip.payment.service.PaymentVerificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HexFormat;

@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class PaymentWebhookController {

    private final PaymentVerificationService verificationService;
    private final PaymentSuccessHandler successHandler;
    private final WebhookLogRepository webhookLogRepository;
    private final PaymentRepository paymentRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${razorpay.secret}")
    private String webhookSecret;

    @PostMapping("/razorpay")
    public String handleWebhook(@RequestBody String payload,
                               @RequestHeader("X-Razorpay-Signature") String signature) {

        // 🔹 Step 1: Save initial log
        WebhookLog log = webhookLogRepository.save(
                WebhookLog.builder()
                        .gateway("RAZORPAY")
                        .payload(payload)
                        .signature(signature)
                        .verificationStatus("RECEIVED")
                        .build()
        );

        try {
            // 🔐 Step 2: Verify webhook signature (CRITICAL)
            if (!verifyWebhookSignature(payload, signature)) {
                log.setVerificationStatus("FAILED");
                webhookLogRepository.save(log);
                throw new RuntimeException("Invalid webhook signature");
            }

            log.setVerificationStatus("VERIFIED");
            webhookLogRepository.save(log);

            // 🔹 Step 3: Parse JSON safely
            JsonNode root = objectMapper.readTree(payload);

            String event = root.path("event").asText();

            // 🔴 Process ONLY successful payment event
            if (!"payment.captured".equals(event)) {
                return "IGNORED";
            }

            JsonNode entity = root.path("payload")
                    .path("payment")
                    .path("entity");

            String orderId = entity.path("order_id").asText();
            String paymentId = entity.path("id").asText();

            if (orderId == null || orderId.isEmpty()) {
                throw new RuntimeException("Invalid order_id in webhook");
            }

            // 🔹 Step 4: Fetch payment
            Payment payment = paymentRepository
                    .findByGatewayOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            // 🔁 Step 5: Idempotency check (VERY IMPORTANT)
            if (payment.getGatewayPaymentId() != null) {
                return "ALREADY_PROCESSED";
            }

            // 🔹 Step 6: Verify + update payment
            Payment verifiedPayment = verificationService.verifyPayment(
                    orderId,
                    paymentId,
                    signature
            );

            // 🔹 Step 7: Handle success flow
            successHandler.handleSuccess(verifiedPayment);

            return "OK";

        } catch (Exception e) {
            log.setVerificationStatus("ERROR: " + e.getMessage());
            webhookLogRepository.save(log);
            throw new RuntimeException(e);
        }
    }

    // 🔐 Razorpay Webhook Signature Verification
    private boolean verifyWebhookSignature(String payload, String actualSignature) {
        try {
            String expectedSignature = hmacSHA256(payload, webhookSecret);
            return expectedSignature.equals(actualSignature);
        } catch (Exception e) {
            return false;
        }
    }

    private String hmacSHA256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey =
                new SecretKeySpec(secret.getBytes(), "HmacSHA256");

        mac.init(secretKey);
        byte[] rawHmac = mac.doFinal(data.getBytes());

        return HexFormat.of().formatHex(rawHmac);
    }
}