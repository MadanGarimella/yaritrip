package com.yaritrip.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(indexes = {
                @Index(name = "idx_from_city", columnList = "from_city_id"),
                @Index(name = "idx_to_city", columnList = "to_city_id"),
                @Index(name = "idx_departure_date", columnList = "departureDate")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPackage {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;

        // ROUTE
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "from_city_id", nullable = false)
        private City fromCity;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "to_city_id", nullable = false)
        private City toCity;

        // IMPORTANT: LAZY to avoid performance issues
        @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        @JsonIgnore
        private List<PackageImage> images;

        @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        private List<Itinerary> itineraries;

        @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        private List<Activity> activities;

        // TRAVEL INFO
        @Column(nullable = false)
        private LocalDate departureDate;

        @Column(nullable = false)
        private int totalRooms;

        @Column(nullable = false)
        private int guestsPerRoom;

        @Column(nullable = false)
        private Integer totalDays;

        @Column(nullable = false)
        private String category;

        // DISPLAY INFO
        @Column(length = 3000)
        private String overview;

        private Double rating;

        // FIX: allow large base64 image
        @Column(columnDefinition = "TEXT")
        private String bannerImageUrl;

        private Double price;

        // RELATIONS
        @ManyToMany(fetch = FetchType.LAZY)
        @JoinTable(name = "package_attractions", joinColumns = @JoinColumn(name = "package_id"), inverseJoinColumns = @JoinColumn(name = "attraction_id"))
        private List<Attraction> attractions;

        @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        @JsonIgnore
        private List<Hotel> hotels;
}