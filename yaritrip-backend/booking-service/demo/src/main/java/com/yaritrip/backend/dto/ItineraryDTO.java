package com.yaritrip.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ItineraryDTO {

    private int dayNumber;
    private String description;
}