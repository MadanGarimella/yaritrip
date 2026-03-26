package com.yaritrip.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "travellers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravellerDetails {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    private String email;

    private String mobile;

    private Integer age;

    private String gender;

    private String passport;

    private String type; 

    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnore
    private Booking booking;
}