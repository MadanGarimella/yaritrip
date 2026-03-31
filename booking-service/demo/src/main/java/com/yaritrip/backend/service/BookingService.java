package com.yaritrip.backend.service;

import com.yaritrip.backend.dto.BookingRequest;
import com.yaritrip.backend.model.Booking;
import com.yaritrip.backend.model.TravellerDetails;
import com.yaritrip.backend.model.User;
import com.yaritrip.backend.repository.BookingRepository;
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

    // 🔥 NEW SERVICES
    private final WalletService walletService;
    private final NotificationService notificationService;

    public Booking createBooking(BookingRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = Booking.builder()
                .packageId(request.getPackageId())
                .totalAmount(request.getTotalAmount())
                .status("CREATED")
                .user(user) // 🔥 LINK USER
                .build();

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

        booking.setTravellers(travellers);

        Booking savedBooking = bookingRepository.save(booking);

        return savedBooking;
    }

    // 🔥 CONFIRM BOOKING (IMPORTANT STEP)
    public Booking confirmBooking(UUID bookingId, String email) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"));

        booking.setStatus("CONFIRMED");

        Booking updated = bookingRepository.save(booking);

        // WALLET REWARD
        walletService.rewardBooking(email);

        // NOTIFICATION
        notificationService.sendBookingConfirmation(email, booking.getId().toString());

        return updated;
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"));
    }

    public Booking updateTravellers(String id, BookingRequest request) {

        Booking booking = bookingRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"));

        booking.getTravellers().clear();

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

        booking.setTravellers(travellers);
        booking.setTotalAmount(request.getTotalAmount());

        return bookingRepository.save(booking);
    }
}