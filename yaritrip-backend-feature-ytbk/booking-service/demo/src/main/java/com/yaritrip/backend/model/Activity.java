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
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @Column(length = 2000)
    private String description; // ADD THIS

    @Column
    private Double price;

    @ManyToOne
    @JoinColumn(name = "package_id")
    @JsonBackReference
    @JsonIgnore
    private TravelPackage travelPackage;
}