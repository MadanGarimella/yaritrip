package com.yaritrip.backend.dto;

import java.util.List;
import java.util.UUID; 

import lombok.Data;
@Data
public class CreatePackageRequest {

    private UUID fromCityId;
    private UUID toCityId;

    private String departureDate;

    private int totalRooms;
    private int guestsPerRoom;
    private int totalDays;

    private String category;
    private String overview;

    private Double price;

    private List<String> images; // base64
}
