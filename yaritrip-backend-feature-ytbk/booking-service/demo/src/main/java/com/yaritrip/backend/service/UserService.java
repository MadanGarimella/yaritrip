package com.yaritrip.backend.service;

import com.yaritrip.backend.dto.UserProfileResponse;
import com.yaritrip.backend.model.User;
import com.yaritrip.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import jakarta.transaction.Transactional;
import com.yaritrip.backend.repository.BookingRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

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
                user.getMobile());
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
}
