package com.yaritrip.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackageImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "package_id")
    @JsonBackReference
    private TravelPackage travelPackage;
}