package com.yaritrip.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private int dayNumber;

    private String title; // ✅ ADD THIS

    @Column(length = 3000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "package_id")
    @JsonBackReference
    @JsonIgnore
    private TravelPackage travelPackage;
}