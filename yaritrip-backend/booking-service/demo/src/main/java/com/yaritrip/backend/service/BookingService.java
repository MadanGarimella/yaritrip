package com.yaritrip.backend.service;

import com.yaritrip.backend.dto.BookingRequest;
import com.yaritrip.backend.model.Booking;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.model.TravellerDetails;
import com.yaritrip.backend.model.User;
import com.yaritrip.backend.repository.BookingRepository;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TravelPackageRepository travelPackageRepository;

    private final WalletService walletService;
    private final NotificationService notificationService;

    // ================= CREATE BOOKING =================
    public Booking createBooking(BookingRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = Booking.builder()
                .packageId(request.getPackageId())
                .adultCount(0)
                .childCount(0)
                .totalAmount(0.0)
                .status("CREATED")
                .user(user)
                .build();

        return bookingRepository.save(booking);
    }

    // ================= CONFIRM BOOKING =================
    public Booking confirmBooking(UUID bookingId, String email) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"));

        booking.setStatus("CONFIRMED");

        Booking updated = bookingRepository.save(booking);

        walletService.rewardBooking(email);
        notificationService.sendBookingConfirmation(email, booking.getId().toString());

        return updated;
    }

    // ================= GET BOOKING =================
    public Booking getBookingById(UUID id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"));
    }

    // ================= UPDATE TRAVELLERS =================
    public Booking updateTravellers(UUID id, BookingRequest request) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"));

        TravelPackage pkg = travelPackageRepository.findById(booking.getPackageId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        double basePrice = pkg.getPrice() != null ? pkg.getPrice() : 0.0;

        List<TravellerDetails> travellers = request.getTravellers()
                .stream()
                .map(t -> TravellerDetails.builder()
                        .name(t.getName())
                        .email(t.getEmail())
                        .mobile(t.getMobile())
                        .age(t.getAge())
                        .gender(t.getGender())
                        .passport(t.getPassport())
                        .type(t.getType())
                        .booking(booking)
                        .build())
                .toList();

        long adultCount = travellers.stream()
                .filter(t -> "ADULT".equalsIgnoreCase(t.getType()))
                .count();

        long childCount = travellers.stream()
                .filter(t -> "CHILD".equalsIgnoreCase(t.getType()))
                .count();

        double adultTotal = adultCount * basePrice;
        double childTotal = childCount * (basePrice * 0.75);
        double totalAmount = adultTotal + childTotal;

        booking.getTravellers().clear();
        booking.setTravellers(travellers);
        booking.setAdultCount((int) adultCount);
        booking.setChildCount((int) childCount);
        booking.setTotalAmount(totalAmount);

        return bookingRepository.save(booking);
    }
}