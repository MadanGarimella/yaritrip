package com.yaritrip.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.yaritrip.backend.model.Activity;
import com.yaritrip.backend.model.ItineraryDay;
import com.fasterxml.jackson.annotation.JsonIgnore;

import com.yaritrip.backend.model.Attraction;
import com.yaritrip.backend.model.City;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonManagedReference;

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

        // -----------------------------
        // ROUTE
        // -----------------------------
        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "from_city_id", nullable = false)
        private City fromCity;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "to_city_id", nullable = false)
        private City toCity;

        @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL)
        @JsonManagedReference
        @JsonIgnore // ✅ ADD THIS LINE
        private List<PackageImage> images;

        @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL)
        @JsonIgnore
        private List<ItineraryDay> itineraryDays;

        @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL)
        @JsonIgnore
        private List<Activity> activities;
        // -----------------------------
        // TRAVEL INFO
        // -----------------------------
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

        // -----------------------------
        // DISPLAY INFO
        // -----------------------------
        @Column(length = 3000)
        private String overview;

        private Double rating;

        private String bannerImageUrl;

        private Double price;

        // -----------------------------
        // RELATIONS
        // -----------------------------
        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(name = "package_attractions", joinColumns = @JoinColumn(name = "package_id"), inverseJoinColumns = @JoinColumn(name = "attraction_id"))
        private List<Attraction> attractions;
}