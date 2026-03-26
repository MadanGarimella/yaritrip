package com.yaritrip.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private Double price;

    private Boolean optional; // true = add-on

    @ManyToOne(fetch = FetchType.LAZY)
    private TravelPackage travelPackage;

    @ManyToOne(fetch = FetchType.LAZY)
    private ItineraryDay itineraryDay; // nullable
}