package com.yaritrip.backend.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class CreateAttractionPackageRequest {

    private String title;
    private String location;
    private int nights;
    private double price;
    private Double rating;
    private String imageUrl;
    private String overview;
    private UUID travelPackageId;
    private List<UUID> attractionIds;
}