package com.yaritrip.backend.service;

import com.yaritrip.backend.model.Stay;
import com.yaritrip.backend.repository.StayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StayService {

    private final StayRepository stayRepository;

    public List<Stay> getStaysByRegion(String region) {
        return stayRepository.findByRegion(region);
    }

    public Stay getStayById(UUID id) {
        return stayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stay not found"));
    }

    public List<Stay> getPremiumStays(String region) {
        return stayRepository.findByRegionAndIsPremium(region, true);
    }

    public Stay createStay(Stay stay) {
        return stayRepository.save(stay);
    }
}