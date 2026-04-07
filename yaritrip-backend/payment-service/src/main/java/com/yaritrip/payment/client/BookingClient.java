package com.yaritrip.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@FeignClient(name = "booking-service", url = "${services.booking.url}")
public interface BookingClient {

    @GetMapping("/bookings/{id}")
    BookingResponse getBooking(@PathVariable UUID id);

    @PostMapping("/bookings/{id}/confirm")
    void confirmBooking(@PathVariable UUID id);

}