package com.yaritrip.payment.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class SignatureUtil {

    public static String generateHmacSHA256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey =
                    new SecretKeySpec(secret.getBytes(), "HmacSHA256");

            mac.init(secretKey);

            byte[] rawHmac = mac.doFinal(data.getBytes());

            return Base64.getEncoder().encodeToString(rawHmac);

        } catch (Exception e) {
            throw new RuntimeException("Error while verifying signature", e);
        }
    }
}