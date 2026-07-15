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
            // Clear existing properties and seed fresh premium hostel data with realistic pricing and photos
            System.out.println("Refreshing and seeding database with premium OYO-style PGs...");
            propertyRepository.deleteAll();

            // 1. Hyderabad Budget PG (Under 8000)
            Property p1 = new Property();
            p1.setName("OYO Life - Gachibowli Hub");
            p1.setDescription("Excellent budget coliving space for boys/working professionals near DLF Cybercity. Fully furnished rooms, 24/7 high-speed Wi-Fi, laundry service, CCTV security, and delicious home-cooked meals included.");
            p1.setCity("Hyderabad");
            p1.setArea("Gachibowli");
            p1.setRent(6800.0);
            p1.setDeposit(10000.0);
            p1.setRooms(15);
            p1.setRoomTypes(Arrays.asList("Double sharing", "Triple sharing"));
            p1.setAmenities(Arrays.asList("Wi-Fi", "Food", "AC", "Security", "Laundry", "Parking"));
            p1.setRules(Arrays.asList("No smoking inside", "Visitor curfew at 10 PM"));
            p1.setOwnerId("owner1");
            p1.setOwnerName("Praveen Prakash");
            p1.setOwnerPhone("+91 94412 12345");
            p1.setOwnerEmail("praveen.hyd@pgmadeeazy.com");
            p1.setCategory("Boys");
            p1.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1626125345510-4603468eedfb?auto=format&fit=crop&w=600&q=80"
            ));
            p1.setApprovalStatus(ApprovalStatus.APPROVED);
            p1.setCreatedAt(new Date());
            p1.setUpdatedAt(new Date());
            p1.setApprovedAt(new Date());
            p1.setApprovedBy("admin");
            propertyRepository.save(p1);

            // 2. Hyderabad Premium PG (Above 8000)
            Property p2 = new Property();
            p2.setName("Isthara IT Coliving Nest");
            p2.setDescription("Premium luxury coliving space in the heart of Gachibowli. Ideal for IT professionals working in Hitec City. Includes swimming pool access, fully equipped gym, three-tier buffet meals, laundry, and housekeeping.");
            p2.setCity("Hyderabad");
            p2.setArea("Gachibowli");
            p2.setRent(14500.0);
            p2.setDeposit(30000.0);
            p2.setRooms(10);
            p2.setRoomTypes(Arrays.asList("Single Room", "Double sharing"));
            p2.setAmenities(Arrays.asList("Wi-Fi", "Food", "AC", "Gym", "Security", "Laundry", "Swimming Pool"));
            p2.setRules(Arrays.asList("No drinking inside rooms", "Guests restricted after 10 PM"));
            p2.setOwnerId("owner2");
            p2.setOwnerName("Kalyan Reddy");
            p2.setOwnerPhone("+91 90000 54321");
            p2.setOwnerEmail("kalyan@pgmadeeazy.com");
            p2.setCategory("Unisex");
            p2.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
            ));
            p2.setApprovalStatus(ApprovalStatus.APPROVED);
            p2.setCreatedAt(new Date());
            p2.setUpdatedAt(new Date());
            p2.setApprovedAt(new Date());
            p2.setApprovedBy("admin");
            propertyRepository.save(p2);

            // 3. Bangalore Budget PG (Under 8000)
            Property p3 = new Property();
            p3.setName("Stanza Living - Dublin Student House");
            p3.setDescription("Super neat and fully managed PG for students in Koramangala. Includes three daily meals, high speed internet, biometric attendance, professional laundry, and 24/7 security warden.");
            p3.setCity("Bangalore");
            p3.setArea("Koramangala");
            p3.setRent(7500.0);
            p3.setDeposit(15000.0);
            p3.setRooms(18);
            p3.setRoomTypes(Arrays.asList("Double sharing", "Triple sharing"));
            p3.setAmenities(Arrays.asList("Wi-Fi", "Food", "Security", "Laundry", "Water Purifier"));
            p3.setRules(Arrays.asList("Curfew at 10:30 PM", "No outsiders allowed in rooms"));
            p3.setOwnerId("owner1");
            p3.setOwnerName("Praveen Prakash");
            p3.setOwnerPhone("+91 94412 12345");
            p3.setOwnerEmail("praveen.blr@pgmadeeazy.com");
            p3.setCategory("Boys");
            p3.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80"
            ));
            p3.setApprovalStatus(ApprovalStatus.APPROVED);
            p3.setCreatedAt(new Date());
            p3.setUpdatedAt(new Date());
            p3.setApprovedAt(new Date());
            p3.setApprovedBy("admin");
            propertyRepository.save(p3);

            // 4. Chennai Girls PG (Under 8000)
            Property p4 = new Property();
            p4.setName("Zolo Coliving - Adyar Rose House");
            p4.setDescription("Highly secure and home-like girls PG in Adyar. Features air-conditioned rooms, daily professional cleaning, nutritious meals, study desks, laundry, and fingerprint access gate control.");
            p4.setCity("Chennai");
            p4.setArea("Adyar");
            p4.setRent(7200.0);
            p4.setDeposit(12000.0);
            p4.setRooms(12);
            p4.setRoomTypes(Arrays.asList("Double sharing", "Triple sharing"));
            p4.setAmenities(Arrays.asList("Wi-Fi", "Food", "AC", "Security", "Laundry"));
            p4.setRules(Arrays.asList("Gate closing at 10 PM", "Quiet hours after 11 PM"));
            p4.setOwnerId("owner3");
            p4.setOwnerName("Srinivasan Iyer");
            p4.setOwnerPhone("+91 98840 98840");
            p4.setOwnerEmail("srini@pgmadeeazy.com");
            p4.setCategory("Girls");
            p4.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1626125345510-4603468eedfb?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
            ));
            p4.setApprovalStatus(ApprovalStatus.APPROVED);
            p4.setCreatedAt(new Date());
            p4.setUpdatedAt(new Date());
            p4.setApprovedAt(new Date());
            p4.setApprovedBy("admin");
            propertyRepository.save(p4);

            System.out.println("Seeding completed successfully!");
        };
    }
}