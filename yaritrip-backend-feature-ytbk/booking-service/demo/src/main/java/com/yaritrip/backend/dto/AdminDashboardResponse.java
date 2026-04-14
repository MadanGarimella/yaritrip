package com.yaritrip.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalBookings;
    private double totalRevenue;
    private long totalPackages;
}