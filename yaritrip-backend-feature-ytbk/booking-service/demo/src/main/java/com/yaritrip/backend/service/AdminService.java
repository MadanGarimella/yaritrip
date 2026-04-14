package com.yaritrip.backend.service;

import com.yaritrip.backend.client.PaymentClient;
import com.yaritrip.backend.dto.AdminDashboardResponse;
import com.yaritrip.backend.model.Booking;
import com.yaritrip.backend.repository.BookingRepository;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepo;
    private final BookingRepository bookingRepo;
    private final TravelPackageRepository packageRepo;
    private final PaymentClient paymentClient;

    public AdminDashboardResponse getDashboardStats() {

        long users = userRepo.count();
        long bookings = bookingRepo.count();
        long packages = packageRepo.count();

        Double revenue;
        try {
            revenue = paymentClient.getTotalRevenue();
        } catch (Exception e) {
            revenue = 0.0;
        }
        if (revenue == null)
            revenue = 0.0;

        return new AdminDashboardResponse(users, bookings, revenue, packages);
    }

    public List<Map<String, Object>> getMonthlyRevenue() {

        List<Object[]> results = bookingRepo.getMonthlyRevenue();

        return results.stream().map(obj -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("month", obj[0]);
            map.put("revenue", obj[1]);
            return map;
        }).toList();
    }

    public List<Map<String, Object>> getBookingsByDestination() {
        return bookingRepo.getBookingsByDestination();
    }

    public List<Map<String, Object>> getRecentBookings() {

        List<Booking> bookings = bookingRepo.findTop5ByOrderByDateDesc();

        return java.util.stream.IntStream.range(0, bookings.size())
                .mapToObj(i -> {

                    Booking b = bookings.get(i);

                    Map<String, Object> map = new java.util.HashMap<>();

                    // 🔥 DESTINATION FIX
                    String destination = "N/A";
                    String cityCode = "UNK";

                    if (b.getPackageId() != null) {
                        var pkgOpt = packageRepo.findById(b.getPackageId());

                        if (pkgOpt.isPresent() && pkgOpt.get().getToCity() != null) {
                            destination = pkgOpt.get().getToCity().getName();

                            cityCode = destination.length() >= 3
                                    ? destination.substring(0, 3).toUpperCase()
                                    : destination.toUpperCase();
                        }
                    }

                    // 🔥 BOOKING ID FIX
                    String bookingId = cityCode + (i + 1);

                    // 🔥 DATE FIX
                    String date = b.getDate() != null
                            ? b.getDate().toLocalDate().toString()
                            : "N/A";

                    // 🔥 AMOUNT FIX
                    double amount = Math.round(b.getTotalAmount() * 100.0) / 100.0;

                    // 🔥 USER FIX
                    String user = (b.getUser() != null)
                            ? b.getUser().getName()
                            : "User";

                    // 🔥 STATUS FIX
                    String status = b.getStatus() != null ? b.getStatus() : "Pending";

                    // 🔥 FINAL MAP
                    map.put("id", bookingId);
                    map.put("user", user);
                    map.put("destination", destination);
                    map.put("date", date);
                    map.put("amount", amount);
                    map.put("status", status);

                    return map;

                }).toList();
    }

    public List<Map<String, Object>> getAllUsers() {

        return userRepo.findAll().stream().map(u -> {

            Map<String, Object> map = new HashMap<>();

            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("mobile", u.getMobile());

            // 🔥 FIX: avoid crash if null
            long bookingCount = bookingRepo.countByUserId(u.getId());
            map.put("bookingCount", bookingCount);

            map.put("createdAt", null); // if not present in DB

            return map;

        }).toList();
    }

    public List<Map<String, Object>> getAllBookings() {

        List<Booking> bookings = bookingRepo.findAllByOrderByDateDesc();

        return java.util.stream.IntStream.range(0, bookings.size())
                .mapToObj(i -> {

                    Booking b = bookings.get(i);

                    Map<String, Object> map = new HashMap<>();

                    // 🔹 BOOKING ID
                    map.put("id", "BKG-" + (i + 1));

                    // 🔹 USER
                    map.put("user", b.getUser() != null ? b.getUser().getName() : "User");

                    // 🔹 DESTINATION
                    String destination = "N/A";
                    if (b.getPackageId() != null) {
                        var pkg = packageRepo.findById(b.getPackageId());
                        if (pkg.isPresent() && pkg.get().getToCity() != null) {
                            destination = pkg.get().getToCity().getName();
                        }
                    }
                    map.put("destination", destination);

                    // 🔹 DATE
                    map.put("date",
                            b.getDate() != null
                                    ? b.getDate().toLocalDate().toString()
                                    : "N/A");

                    // 🔹 AMOUNT
                    map.put("amount", b.getTotalAmount());

                    // 🔹 STATUS
                    map.put("status",
                            b.getStatus() != null ? b.getStatus() : "Pending");

                    return map;

                }).toList();
    }
}