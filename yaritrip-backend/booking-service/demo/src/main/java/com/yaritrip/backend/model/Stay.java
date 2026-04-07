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
public class Stay {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String location;   // Agra, Jaipur, etc.

    @Column(nullable = false)
    private String region;     // NORTH, SOUTH, EAST, WEST

    private Double rating;

    private Integer reviews;

    private String duration;   // "2 days / 3 nights"

    @Column(nullable = false)
    private Double startingPrice;

    private String imageUrl;

    private Boolean isPremium; // true = premium, false = tourist
}