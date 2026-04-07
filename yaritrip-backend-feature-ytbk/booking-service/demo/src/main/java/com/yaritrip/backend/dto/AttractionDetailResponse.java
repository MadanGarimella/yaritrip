package com.yaritrip.backend.dto;

import java.util.UUID;

public record AttractionDetailResponse(
        UUID id,
        String title,
        String city,
        String description,
        String imageUrl,
        double rating,
        int reviews
) {}