package com.yaritrip.payment.enums;

public enum PaymentEventType {
    INITIATED,
    REQUEST_SENT,
    RESPONSE_RECEIVED,
    SUCCESS,
    FAILED,
    WEBHOOK_RECEIVED,
    WEBHOOK_VERIFIED
}