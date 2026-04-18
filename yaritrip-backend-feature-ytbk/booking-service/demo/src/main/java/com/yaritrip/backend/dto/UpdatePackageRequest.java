package com.yaritrip.backend.dto;

import lombok.Data;
import java.util.UUID;
import java.util.List;

@Data
public class UpdatePackageRequest {

    private Double price;
    private Integer totalDays;
    private Integer totalRooms;
    private Integer guestsPerRoom;
    private String category;
    private String overview;
    private Double rating;

    // ✅ FIX NAME (VERY IMPORTANT)
    private List<ItineraryDTO> itinerary;
    private List<ActivityDTO> activities;
}