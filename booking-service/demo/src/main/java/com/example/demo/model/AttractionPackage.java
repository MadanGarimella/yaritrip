package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;
import java.util.List;

@Entity
@Table(name = "attraction_packages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttractionPackage {

    @Id
    @GeneratedValue
    private UUID id;

    private String title;

    private String location;

    private int nights;

    private double price;

    private Double rating;
    // private double rating;

    private String imageUrl;

    @Column(length = 20000)
    private String overview;

    @ManyToMany
    @JoinTable(
        name = "attraction_package_mapping",
        joinColumns = @JoinColumn(name = "package_id"),
        inverseJoinColumns = @JoinColumn(name = "attraction_id")
    )
    private List<Attraction> attractions;

    @ManyToOne
    @JoinColumn(name = "travel_package_id")
    private TravelPackage travelPackage;
}