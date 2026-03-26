package com.yaritrip.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PackageResponse {

    private UUID id;
    private String title;
    private String location;
    private Integer nights;
    private Double price;
    private Double rating;
    private String image;
    private List<String> images;
    private String overview;
}