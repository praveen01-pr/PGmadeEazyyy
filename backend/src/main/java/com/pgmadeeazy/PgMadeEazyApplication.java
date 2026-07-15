package com.pgmadeeazy;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;

import com.pgmadeeazy.model.Property;
import com.pgmadeeazy.model.ApprovalStatus;
import com.pgmadeeazy.repository.PropertyRepository;
import com.pgmadeeazy.properties.CloudinaryProperties;

import java.util.Arrays;
import java.util.Date;

@SpringBootApplication
@EnableConfigurationProperties(CloudinaryProperties.class)
@EnableAsync
public class PgMadeEazyApplication {
    public static void main(String[] args) {
        SpringApplication.run(PgMadeEazyApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(PropertyRepository propertyRepository) {
        return args -> {
            if (propertyRepository.count() == 0) {
                System.out.println("Seeding database with premium OYO-style properties...");

                Property p1 = new Property();
                p1.setName("OYO Life - Dublin House");
                p1.setDescription("Premium fully furnished coliving rooms for students and working professionals. Located in the heart of the city with excellent connectivity, daily housekeeping, high-speed WiFi, and home-cooked meals included.");
                p1.setCity("Bangalore");
                p1.setArea("Koramangala");
                p1.setRent(6500.0);
                p1.setDeposit(12000.0);
                p1.setRooms(8);
                p1.setRoomTypes(Arrays.asList("Single sharing", "Double sharing"));
                p1.setAmenities(Arrays.asList("Wi-Fi", "Food", "AC", "Security", "Laundry"));
                p1.setRules(Arrays.asList("No smoking inside rooms", "Visitor entry allowed until 10 PM", "Quiet hours after 11 PM"));
                p1.setOwnerId("64d1f2e15bc3251234a56b78");
                p1.setOwnerName("Praveen Prakash");
                p1.setOwnerPhone("9876543210");
                p1.setOwnerEmail("praveen@gmail.com");
                p1.setCategory("Unisex");
                p1.setImages(Arrays.asList(
                    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80"
                ));
                p1.setApprovalStatus(ApprovalStatus.APPROVED);
                p1.setCreatedAt(new Date());
                p1.setUpdatedAt(new Date());
                p1.setApprovedAt(new Date());
                p1.setApprovedBy("admin");
                propertyRepository.save(p1);

                Property p2 = new Property();
                p2.setName("Stanza Living - Orchid House");
                p2.setDescription("A premium girls coliving PG with top-notch security features. Features spacious common rooms, fully functional fitness center, gaming lounge, and laundry facilities. Healthy meals served thrice a day.");
                p2.setCity("Bangalore");
                p2.setArea("Indiranagar");
                p2.setRent(8500.0);
                p2.setDeposit(15000.0);
                p2.setRooms(12);
                p2.setRoomTypes(Arrays.asList("Single sharing", "Double sharing", "Triple sharing"));
                p2.setAmenities(Arrays.asList("Wi-Fi", "Food", "Gym", "Security", "Laundry", "TV"));
                p2.setRules(Arrays.asList("Gate closing time at 10:30 PM", "No outsiders allowed in rooms", "Maintain hygiene in common spaces"));
                p2.setOwnerId("64d1f2e15bc3251234a56b78");
                p2.setOwnerName("Praveen Prakash");
                p2.setOwnerPhone("9876543210");
                p2.setOwnerEmail("praveen@gmail.com");
                p2.setCategory("Girls");
                p2.setImages(Arrays.asList(
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80"
                ));
                p2.setApprovalStatus(ApprovalStatus.APPROVED);
                p2.setCreatedAt(new Date());
                p2.setUpdatedAt(new Date());
                p2.setApprovedAt(new Date());
                p2.setApprovedBy("admin");
                propertyRepository.save(p2);

                Property p3 = new Property();
                p3.setName("OYO Coliving - Adyar Nest");
                p3.setDescription("A modern, tech-enabled coliving facility for boys. Complete with smart locks, common study tables, high-speed business WiFi, laundry service, and healthy traditional South Indian meals.");
                p3.setCity("Chennai");
                p3.setArea("Adyar");
                p3.setRent(5500.0);
                p3.setDeposit(10000.0);
                p3.setRooms(6);
                p3.setRoomTypes(Arrays.asList("Double sharing", "Triple sharing"));
                p3.setAmenities(Arrays.asList("Wi-Fi", "Food", "Security", "Laundry"));
                p3.setRules(Arrays.asList("No smoking/drinking allowed", "Visitors entry allowed in common lounge only", "Inform warden before night-out"));
                p3.setOwnerId("64d1f2e15bc3251234a56b79");
                p3.setOwnerName("Rakesh Kumar");
                p3.setOwnerPhone("9988776655");
                p3.setOwnerEmail("rakesh@gmail.com");
                p3.setCategory("Boys");
                p3.setImages(Arrays.asList(
                    "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
                ));
                p3.setApprovalStatus(ApprovalStatus.APPROVED);
                p3.setCreatedAt(new Date());
                p3.setUpdatedAt(new Date());
                p3.setApprovedAt(new Date());
                p3.setApprovedBy("admin");
                propertyRepository.save(p3);

                System.out.println("Database seeded successfully!");
            }
        };
    }
}