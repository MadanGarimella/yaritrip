package com.yaritrip.backend.service;

import com.yaritrip.backend.dto.UserProfileResponse;
import com.yaritrip.backend.model.User;
import com.yaritrip.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import jakarta.transaction.Transactional;
import com.yaritrip.backend.repository.BookingRepository;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.io.IOException;

import java.io.File;
import java.nio.file.Path;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public UserProfileResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getMobile(),
                user.getProfileImage() );
    }

    public List<Map<String, Object>> getAllUsers() {

        return userRepository.findAll().stream().map(u -> {

            Map<String, Object> map = new HashMap<>();

            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("mobile", u.getMobile());

            // booking count
            long bookingCount = bookingRepository.countByUserId(u.getId());
            map.put("bookingCount", bookingCount);

            map.put("createdAt", null); // optional if not present

            return map;

        }).toList();
    }

    @Transactional
    public void deleteUser(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // STEP 1: remove FK references
        bookingRepository.removeUserReference(userId);

        // 🔥 STEP 2: delete user
        userRepository.delete(user);
    }

    public String uploadProfileImage(String email, MultipartFile file) {

        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 📁 Create uploads folder if not exists
            String uploadDir = "uploads/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 🧾 Unique file name
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // 📍 Save file
            Path path = Paths.get(uploadDir + fileName);
            Files.write(path, file.getBytes());

            // 🌐 Save URL in DB
            String imageUrl = "http://localhost:8082/" + fileName;
            user.setProfileImage(imageUrl);

            userRepository.save(user);

            return imageUrl;

        } catch (IOException e) {
            throw new RuntimeException("File upload failed", e);
        }
    }
}
