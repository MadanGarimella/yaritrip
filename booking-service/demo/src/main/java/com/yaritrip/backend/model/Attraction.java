package com.yaritrip.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attraction {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String location;
    private String description;
    private String imageUrl;
    private Double rating;
    private Integer reviews;
    private Boolean isPopular;
}
