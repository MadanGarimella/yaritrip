package com.yaritrip.backend.dto;

import lombok.Data;

@Data
public class TravellerRequest {

    private String name;
    private String email;
    private String mobile;
    private Integer age;
    private String gender;
    private String passport;
    private String type;
}