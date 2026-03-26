package com.yaritrip.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PriceResponse {

    private Double basePrice;
    private Double activitiesTotal;
    private Double finalPrice;
}