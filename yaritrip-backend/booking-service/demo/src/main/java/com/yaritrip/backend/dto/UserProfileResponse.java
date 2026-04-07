package com.yaritrip.backend.dto;

import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String name,
        String email,
        String mobile
) {}
