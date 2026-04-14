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
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String roomType;
    private int nights;
    private int starRating;

    @ManyToOne
    @JoinColumn(name = "package_id")
    private TravelPackage travelPackage;
}