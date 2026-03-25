package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;

    @Column(length = 2000)
    private String description; 

    @ManyToOne(fetch = FetchType.LAZY)
    private TravelPackage travelPackage;
}