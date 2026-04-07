package com.yaritrip.backend.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PackageResponse {

    private UUID id;
    private String title;
    private String location;
    private Integer nights;
    private Double rating;
    private Double price;
    private UUID originalPackageId;
    private List<String> itinerary;
    private List<String> features;
    private List<String> highlights;
    private String image;
    private List<String> images;
    private String overview;
}