package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AttractionPackageResponse {

    private UUID id;
    private String title;
    private String location;
    private int nights;
    private double price;
    private double rating;
    private String image;
    private List<String> images;
    private String overview;
    private UUID travelPackageId;
}