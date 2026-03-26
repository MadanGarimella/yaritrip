package com.yaritrip.backend.config;

import com.yaritrip.backend.model.Attraction;
import com.yaritrip.backend.model.AttractionPackage;
import com.yaritrip.backend.model.Stay;
import com.yaritrip.backend.model.TravelPackage;
import com.yaritrip.backend.model.City;

import com.yaritrip.backend.repository.AttractionRepository;
import com.yaritrip.backend.repository.AttractionPackageRepository;
import com.yaritrip.backend.repository.StayRepository;
import com.yaritrip.backend.repository.TravelPackageRepository;
import com.yaritrip.backend.repository.CityRepository;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

        private final AttractionRepository attractionRepository;
        private final StayRepository stayRepository;
        private final CityRepository cityRepository;
        private final TravelPackageRepository travelPackageRepository;
        private final AttractionPackageRepository attractionPackageRepository;

        @Override
        public void run(String... args) {

                // Clear old data
                attractionPackageRepository.deleteAll();
                travelPackageRepository.deleteAll();
                attractionRepository.deleteAll();
                stayRepository.deleteAll();
                cityRepository.deleteAll();

                // Seed fresh data
                seedCities();
                seedAttractions();
                seedStays();
                seedPackages();
                seedAttractionPackages();

                System.out.println("✅ All data seeded successfully");

                try {
                        seedAttractionPackages();
                } catch (Exception e) {
                        System.out.println("⚠️ Skipping attraction seeding: " + e.getMessage());
                }

                if (attractionPackageRepository.count() == 0) {
                        seedAttractionPackages();
                }
        }

        /*
         * ==========================
         * SEED ATTRACTIONS
         * ==========================
         */
        private void seedAttractions() {

                attractionRepository.save(
                                Attraction.builder()
                                                .name("Burj Khalifa")
                                                .location("Dubai")
                                                .description("Experience the tallest building in the world with stunning city views.")
                                                .imageUrl("https://climatecontrol.imiplc.com/_next/image?url=https%3A%2F%2Fcdn.tessa.imihy.eimed-project.de%2F621346%2FWeb_Header%2FBurj_Khalifa_Tower.webp&w=3840&q=75")
                                                .rating(4.9)
                                                .isPopular(true)
                                                .build());

                attractionRepository.save(
                                Attraction.builder()
                                                .name("Museum of The Future")
                                                .location("Dubai")
                                                .description("Explore the futuristic museum showcasing cutting-edge innovations.")
                                                .imageUrl("https://lh3.googleusercontent.com/gps-cs-s/AHVAweo_AgJJfdiWB8t36ZQ21wMMDSAvmzoNUDcUSZA17pGD1E4b4U2ooLKbRPyDEp0FyghkKEBQIhTwQcRtJunOPRQ6lejlQCp3WSCMEL7UTSfhbJPC4TPyo7C6tbVSIDa282rFchhz1cb5uws=s294-w294-h220-n-k-no")
                                                .rating(4.8)
                                                .isPopular(true)
                                                .build());

                attractionRepository.save(
                                Attraction.builder()
                                                .name("Charminar Hyderabad")
                                                .location("India")
                                                .description("Famous historic monument in Hyderabad.")
                                                .imageUrl("https://lh3.googleusercontent.com/gps-cs-s/AHVAwer210TkmDg0imN8Qd77lgHj2goo4VB7kAOLHlC9EpYbSrhenXo10mIc1l_uDlllPXeKKmbihcnMWJpqJdsPwEtdaVo9eCtxzF6uH46rcixvtpsCO09fGWCRcoRcq4hTVT_UuBfz=s294-w294-h220-n-k-no")
                                                .rating(4.8)
                                                .isPopular(true)
                                                .build());

                attractionRepository.save(
                                Attraction.builder()
                                                .name("Singapore Anyway Package")
                                                .location("Singapore")
                                                .description("Relax in luxury houseboats through serene backwaters.")
                                                .imageUrl("https://www.gokitetours.com/wp-content/uploads/2019/11/singpore-tour-packages-from-india.webp")
                                                .rating(4.8)
                                                .isPopular(true)
                                                .build());

                attractionRepository.save(
                                Attraction.builder()
                                                .name("The Temple of the Emerald Buddha")
                                                .location("Bangkok")
                                                .description("Sacred temple located inside the Grand Palace.")
                                                .imageUrl("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee")
                                                .rating(4.7)
                                                .isPopular(false)
                                                .build());

                System.out.println("✅ Attractions seeded");
        }

        /*
         * ==========================
         * SEED STAYS
         * ==========================
         */
        private void seedStays() {

                stayRepository.save(
                                Stay.builder()
                                                .name("The Oberoi Amarvilas")
                                                .location("Agra")
                                                .region("NORTH")
                                                .rating(8.9)
                                                .reviews(2140)
                                                .duration("2 days / 3 nights")
                                                .startingPrice(22500.0)
                                                .imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945")
                                                .isPremium(true)
                                                .build());

                stayRepository.save(
                                Stay.builder()
                                                .name("Jaipur Heritage Palace")
                                                .location("Jaipur")
                                                .region("NORTH")
                                                .rating(8.9)
                                                .reviews(1820)
                                                .duration("3 days / 4 nights")
                                                .startingPrice(18200.0)
                                                .imageUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b")
                                                .isPremium(true)
                                                .build());

                stayRepository.save(
                                Stay.builder()
                                                .name("Goa Beachside Resort")
                                                .location("Goa")
                                                .region("WEST")
                                                .rating(8.7)
                                                .reviews(2560)
                                                .duration("3 days / 3 nights")
                                                .startingPrice(14500.0)
                                                .imageUrl("https://images.unsplash.com/photo-1501117716987-c8e1ecb2104c")
                                                .isPremium(true)
                                                .build());

                stayRepository.save(
                                Stay.builder()
                                                .name("Udaipur Lake Palace Retreat")
                                                .location("Udaipur")
                                                .region("WEST")
                                                .rating(9.4)
                                                .reviews(1675)
                                                .duration("2 days / 2 nights")
                                                .startingPrice(19800.0)
                                                .imageUrl("https://images.unsplash.com/photo-1524492449090-1d08a7b8ff30")
                                                .isPremium(true)
                                                .build());

                stayRepository.save(
                                Stay.builder()
                                                .name("Kerala Backwater Luxury Stay")
                                                .location("Alleppey")
                                                .region("SOUTH")
                                                .rating(9.1)
                                                .reviews(1320)
                                                .duration("2 days / 2 nights")
                                                .startingPrice(16200.0)
                                                .imageUrl("https://images.unsplash.com/photo-1587135991058-8816c8f1a1e0")
                                                .isPremium(true)
                                                .build());

                stayRepository.save(
                                Stay.builder()
                                                .name("Darjeeling Himalayan Retreat")
                                                .location("Darjeeling")
                                                .region("EAST")
                                                .rating(8.8)
                                                .reviews(980)
                                                .duration("2 days / 3 nights")
                                                .startingPrice(11800.0)
                                                .imageUrl("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee")
                                                .isPremium(true)
                                                .build());

                System.out.println("✅ Stays seeded");
        }

        /*
         * ==========================
         * SEED CITIES
         * ==========================
         */
        private void seedCities() {

                cityRepository.save(City.builder().name("Hyderabad").code("HYD").country("India").build());
                cityRepository.save(City.builder().name("Delhi").code("DEL").country("India").build());
                cityRepository.save(City.builder().name("Kerala").code("KD").country("India").build());
                cityRepository.save(City.builder().name("Kashmir").code("SXR").country("India").build());
                cityRepository.save(City.builder().name("Andaman").code("IXZ").country("India").build());
                cityRepository.save(City.builder().name("Mumbai").code("BOM").country("India").build());
                cityRepository.save(City.builder().name("Dubai").code("DXB").country("UAE").build());
                cityRepository.save(City.builder().name("Kuala Lumpur").code("KUL").country("Malaysia").build());
                cityRepository.save(City.builder().name("Vietnam").code("VN").country("Vietnam").build());
                cityRepository.save(City.builder().name("Singapore").code("SIN").country("Singapore").build());
                cityRepository.save(City.builder().name("Bali").code("DPS").country("Indonesia").build());
                cityRepository.save(City.builder().name("Bangkok").code("PG").country("Thailand").build());
                cityRepository.save(City.builder().name("Male").code("MLE").country("Maldives").build());

                System.out.println("Cities seeded successfully ✅");
        }

        /*
         * ==========================
         * SEED TRAVEL PACKAGES
         * ==========================
         */
        private void seedPackages() {

                List<City> cities = cityRepository.findAll();

                for (City from : cities) {
                        for (City to : cities) {

                                if (from.getId().equals(to.getId()))
                                        continue;

                                boolean isDomestic = from.getCountry().equalsIgnoreCase(to.getCountry());

                                double basePrice;

                                if (isDomestic) {
                                        basePrice = 25000 + (Math.random() * 20000);
                                } else {
                                        basePrice = 65000 + (Math.random() * 60000);
                                }

                                int nights;

                                if (isDomestic) {
                                        nights = 2 + (int) (Math.random() * 2);
                                } else {
                                        nights = 4 + (int) (Math.random() * 3);
                                }

                                List<Attraction> attractions = attractionRepository
                                                .findByLocationIgnoreCase(to.getName());

                                travelPackageRepository.save(
                                                TravelPackage.builder()
                                                                .fromCity(from)
                                                                .toCity(to)
                                                                .departureDate(LocalDate.now()
                                                                                .plusDays((int) (Math.random() * 30)))
                                                                .totalDays(nights)
                                                                .price(basePrice)
                                                                .totalRooms(10)
                                                                .guestsPerRoom(8)
                                                                .attractions(attractions)
                                                                .category(isDomestic ? "DOMESTIC" : "INTERNATIONAL")
                                                                .build());
                        }
                }

                System.out.println("✅ Smart packages seeded successfully");
        }

        /*
         * ==========================
         * SEED ATTRACTION PACKAGES
         * ==========================
         */
        private void seedAttractionPackages() {

                System.out.println("TOTAL TRAVEL PACKAGES: " + travelPackageRepository.count());
                travelPackageRepository.findAll()
                                .forEach(p -> System.out.println("→ " + p.getToCity().getName()));

                List<Attraction> dubai = attractionRepository.findByLocationIgnoreCase("Dubai");
                List<Attraction> india = attractionRepository.findByLocationIgnoreCase("India");
                List<Attraction> singapore = attractionRepository.findByLocationIgnoreCase("Singapore");
                List<Attraction> bangkok = attractionRepository.findByLocationIgnoreCase("Bangkok");

                // ✅ FETCH CORRESPONDING TRAVEL PACKAGES (CRITICAL FIX)
                TravelPackage dubaiPackage = travelPackageRepository.findAll().stream()
                                .filter(p -> p.getToCity() != null && "Dubai".equalsIgnoreCase(p.getToCity().getName()))
                                .findFirst()
                                .orElse(null);

                TravelPackage indiaPackage = travelPackageRepository.findAll().stream()
                                .filter(p -> p.getToCity() != null && "India".equalsIgnoreCase(p.getToCity().getName()))
                                .findFirst()
                                .orElse(null);

                TravelPackage singaporePackage = travelPackageRepository.findAll().stream()
                                .filter(p -> p.getToCity() != null
                                                && "Singapore".equalsIgnoreCase(p.getToCity().getName()))
                                .findFirst()
                                .orElse(null);

                TravelPackage bangkokPackage = travelPackageRepository.findAll().stream()
                                .filter(p -> p.getToCity() != null
                                                && "Bangkok".equalsIgnoreCase(p.getToCity().getName()))
                                .findFirst()
                                .orElse(null);

                attractionPackageRepository.save(
                                AttractionPackage.builder()
                                                .title("Dubai Luxury Experience")
                                                .location("Dubai")
                                                .nights(5)
                                                .price(120000)
                                                .rating(4.8)
                                                .imageUrl("/images/attractions/dubai/aerial-view-downtown-dubai-autumn-day-united-arab-emirates.jpg")
                                                .overview("Explore Dubai with Burj Khalifa and Museum of the Future.")
                                                .attractions(dubai)
                                                .travelPackage(dubaiPackage) // ✅ FIXED
                                                .build());

                attractionPackageRepository.save(
                                AttractionPackage.builder()
                                                .title("India Heritage Tour")
                                                .location("India")
                                                .nights(4)
                                                .price(55000)
                                                .rating(4.7)
                                                .imageUrl("/images/attractions/india/india-package.jpg")
                                                .overview("Discover Charminar and Indian heritage.")
                                                .attractions(india)
                                                .travelPackage(indiaPackage) // ✅ FIXED
                                                .build());

                attractionPackageRepository.save(
                                AttractionPackage.builder()
                                                .title("Singapore Discovery Trip")
                                                .location("Singapore")
                                                .nights(4)
                                                .price(98000)
                                                .rating(4.7)
                                                .imageUrl("/images/attractions/singapore/singapore-package.jpg")
                                                .overview("Experience Singapore skyline and Marina Bay.")
                                                .attractions(singapore)
                                                .travelPackage(singaporePackage) // ✅ FIXED
                                                .build());

                attractionPackageRepository.save(
                                AttractionPackage.builder()
                                                .title("Bangkok Cultural Journey")
                                                .location("Bangkok")
                                                .nights(4)
                                                .price(87000)
                                                .rating(4.6)
                                                .imageUrl("/images/attractions/bangkok/bangkok-package.jpg")
                                                .overview("Discover temples and Thai culture.")
                                                .attractions(bangkok)
                                                .travelPackage(bangkokPackage) // ✅ FIXED
                                                .build());

                System.out.println("✅ Attraction packages seeded successfully");
        }
}