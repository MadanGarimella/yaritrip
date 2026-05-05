package com.yaritrip.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreatePackageRequest {

    private String location;     
    private Integer totalDays;

    private UUID fromCityId;
    private UUID toCityId;

    private String departureDate;

    private int totalRooms;
    private int guestsPerRoom;

    private String category;
    private String overview;

    private Double price;

    private List<String> images;

    private List<ItineraryDTO> itinerary;
    private List<ActivityDTO> activities;
}