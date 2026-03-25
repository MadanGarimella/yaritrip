package com.example.demo.service;

import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.TravellerRequest;
import com.example.demo.model.Booking;
import com.example.demo.model.TravellerDetails;
import com.example.demo.repository.BookingRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

        private final BookingRepository bookingRepository;

        public Booking createBooking(BookingRequest request) {

                Booking booking = Booking.builder()
                                .packageId(request.getPackageId())
                                .totalAmount(request.getTotalAmount())
                                .status("CREATED")
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

                booking.setTotalAmount(request.getTotalAmount());

                return bookingRepository.save(booking);
        }

        public Booking getBookingById(String id) {
                return bookingRepository.findById(java.util.UUID.fromString(id))
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Booking not found"));
        }

        public Booking updateTravellers(String id, BookingRequest request) {

                Booking booking = bookingRepository.findById(java.util.UUID.fromString(id))
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Booking not found"));

                // Clear existing travellers
                booking.getTravellers().clear();

                // Add updated travellers
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

                // Update total amount
                booking.setTotalAmount(request.getTotalAmount());

                return bookingRepository.save(booking);
        }
}