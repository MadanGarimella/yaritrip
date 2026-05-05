package com.yaritrip.backend.service;

import com.yaritrip.backend.client.PaymentClient;
import com.yaritrip.backend.dto.AdminDashboardResponse;
import com.yaritrip.backend.model.Booking;
import com.yaritrip.backend.model.PackageImage;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.repository.BookingRepository;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.repository.UserRepository;
import com.yaritrip.backend.repository.PackageImageRepository;
import com.yaritrip.backend.repository.CityRepository;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.io.File;
import java.nio.file.Path;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TravelPackageRepository travelPackageRepository;
    private final PaymentClient paymentClient;
    private final WalletService walletService;
    private final NotificationService notificationService;

    // ================= DASHBOARD =================
    public AdminDashboardResponse getDashboardStats() {

        long users = userRepository.count();
        long bookings = bookingRepository.count();
        long packages = travelPackageRepository.count();

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

    // ================= REVENUE =================
    public List<Map<String, Object>> getMonthlyRevenue() {

        List<Object[]> results = bookingRepository.getMonthlyRevenue();

        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] obj : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", obj[0]);
            map.put("revenue", obj[1]);
            response.add(map);
        }

        return response;
    }

    // ================= DESTINATIONS =================
    public List<Map<String, Object>> getBookingsByDestination() {

        List<Object[]> results = bookingRepository.getBookingsByDestination();

        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("destination", row[0]);
            map.put("count", row[1]);
            response.add(map);
        }

        return response;
    }

    // ================= RECENT BOOKINGS =================
    public List<Map<String, Object>> getRecentBookings() {

        List<Booking> bookings = bookingRepository.findTop5WithDetails();

        List<Map<String, Object>> response = new ArrayList<>();

        for (int i = 0; i < bookings.size(); i++) {

            Booking b = bookings.get(i);
            Map<String, Object> map = new HashMap<>();

            // ✅ DESTINATION FIX (correct relation usage)
            String destination = "N/A";
            String cityCode = "UNK";

            if (b.getTravelPackage() != null &&
                    b.getTravelPackage().getToCity() != null) {

                destination = b.getTravelPackage().getToCity().getName();

                cityCode = destination.length() >= 3
                        ? destination.substring(0, 3).toUpperCase()
                        : destination.toUpperCase();
            }

            // ✅ BOOKING ID
            String bookingId = cityCode + (i + 1);

            // ✅ DATE
            String date = (b.getDate() != null)
                    ? b.getDate().toLocalDate().toString()
                    : "N/A";

            // ✅ AMOUNT (null safe)
            double amount = b.getTotalAmount() != null
                    ? Math.round(b.getTotalAmount() * 100.0) / 100.0
                    : 0.0;

            // ✅ USER
            String user = (b.getUser() != null)
                    ? b.getUser().getName()
                    : "User";

            // ✅ STATUS
            String status = (b.getStatus() != null)
                    ? b.getStatus()
                    : "Pending";

            map.put("id", bookingId);
            map.put("user", user);
            map.put("destination", destination);
            map.put("date", date);
            map.put("amount", amount);
            map.put("status", status);

            response.add(map);
        }

        return response;
    }

    // ================= USERS =================
    public List<Map<String, Object>> getAllUsers() {

        List<Map<String, Object>> response = new ArrayList<>();

        userRepository.findAll().forEach(u -> {

            Map<String, Object> map = new HashMap<>();

            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("mobile", u.getMobile());

            long bookingCount = bookingRepository.countByUserId(u.getId());
            map.put("bookingCount", bookingCount);

            map.put("createdAt", null);

            response.add(map);
        });

        return response;
    }

    // ================= BOOKINGS =================
    public List<Map<String, Object>> getAllBookings() {

        List<Booking> bookings = bookingRepository.findAllWithDetails();

        List<Map<String, Object>> response = new ArrayList<>();

        for (int i = 0; i < bookings.size(); i++) {

            Booking b = bookings.get(i);
            Map<String, Object> map = new HashMap<>();

            map.put("id", "BKG-" + (i + 1));

            map.put("user",
                    b.getUser() != null ? b.getUser().getName() : "User");

            String destination = "N/A";

            if (b.getTravelPackage() != null &&
                    b.getTravelPackage().getToCity() != null) {

                destination = b.getTravelPackage().getToCity().getName();
            }

            map.put("destination", destination);

            map.put("date",
                    b.getDate() != null
                            ? b.getDate().toLocalDate().toString()
                            : "N/A");

            map.put("amount",
                    b.getTotalAmount() != null ? b.getTotalAmount() : 0);

            map.put("status",
                    b.getStatus() != null ? b.getStatus() : "Pending");

            response.add(map);
        }

        return response;
    }

    // ================= IMAGE UPLOAD =================
    public String uploadImage(UUID id, MultipartFile file) {

        try {
            TravelPackage pkg = travelPackageRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Package not found"));

            String uploadDir = "uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists())
                dir.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir + fileName);
            Files.write(path, file.getBytes());

            String url = "/uploads/" + fileName;

            PackageImage img = new PackageImage();
            img.setImageUrl(url);
            img.setTravelPackage(pkg);

            if (pkg.getImages() == null) {
                pkg.setImages(new ArrayList<>());
            }

            pkg.getImages().add(img);

            if (pkg.getBannerImageUrl() == null) {
                pkg.setBannerImageUrl(url);
            }

            travelPackageRepository.save(pkg);

            return url;

        } catch (Exception e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }
}