package com.yaritrip.backend.controller;

import com.yaritrip.backend.service.UserService;

import com.yaritrip.backend.dto.UserProfileResponse;
import com.yaritrip.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/me")
  public UserProfileResponse getCurrentUser(Authentication authentication) {

    System.out.println(authentication.getPrincipal());

    String email = authentication.getName();
    // String name = authentication.getMobile();

    return userService.getUserProfile(email);
  }

  @PostMapping("/upload-profile")
  public ResponseEntity<?> uploadProfile(
      @RequestParam("file") MultipartFile file,
      Authentication auth) {

    String email = auth.getName();

    String imageUrl = userService.uploadProfileImage(email, file);

    return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
  }

}
