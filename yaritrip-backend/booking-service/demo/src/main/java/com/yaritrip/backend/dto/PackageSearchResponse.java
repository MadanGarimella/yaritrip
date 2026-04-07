package com.yaritrip.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class PackageSearchResponse {

    private UUID id;

    private String fromCity;
    private String toCity;

    private Integer nights;

    private Double price;
    private Double rating;

    private String bannerImage;
}