package com.yaritrip.backend.dto;

import lombok.*;

@Data
@Builder  
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDTO {

    private String name;
    private String description;
    private Double price; 
}