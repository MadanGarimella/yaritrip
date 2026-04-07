package com.yaritrip.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/secure")
    public String secure() {
        return "You are authenticated";
    }
}
