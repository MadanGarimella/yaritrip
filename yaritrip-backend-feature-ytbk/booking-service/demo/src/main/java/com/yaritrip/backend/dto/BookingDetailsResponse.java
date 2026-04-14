package com.yaritrip.backend.dto;

import com.yaritrip.backend.model.Booking;
import com.yaritrip.backend.model.TravelPackage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDetailsResponse {
    private Booking booking;
    private TravelPackage travelPackage;
}