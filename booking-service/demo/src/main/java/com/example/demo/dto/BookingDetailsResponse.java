package com.example.demo.dto;

import com.example.demo.model.Booking;
import com.example.demo.model.TravelPackage;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingDetailsResponse {
    private Booking booking;
    private TravelPackage travelPackage;
}