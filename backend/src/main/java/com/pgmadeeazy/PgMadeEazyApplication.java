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
            // Seed a full dataset of realistic coliving hostels (all priced above ₹5,000)
            System.out.println("Refreshing and seeding database with a comprehensive list of premium hostels...");
            propertyRepository.deleteAll();

            // 1. Hyderabad Budget PG (Boys) - ₹6,800
            Property p1 = new Property();
            p1.setName("OYO Life - Gachibowli Boys PG");
            p1.setDescription("Budget-friendly boys PG located near DLF Cybercity. Cozy twin sharing rooms, high-speed Wi-Fi, laundry facilities, CCTV protection, and fresh nutritious meals included.");
            p1.setCity("Hyderabad");
            p1.setArea("Gachibowli");
            p1.setRent(6800.0);
            p1.setDeposit(10000.0);
            p1.setRooms(12);
            p1.setRoomTypes(Arrays.asList("Double sharing", "Triple sharing"));
            p1.setAmenities(Arrays.asList("Wi-Fi", "Food", "AC", "Security", "Laundry"));
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

            // 2. Hyderabad Premium Coliving (Unisex) - ₹14,500
            Property p2 = new Property();
            p2.setName("Isthara Premium Coliving");
            p2.setDescription("Luxury unisex coliving hub in Gachibowli. Features private workstations, fully functional fitness center, indoor games, community pool, laundry, and daily buffet dining.");
            p2.setCity("Hyderabad");
            p2.setArea("Gachibowli");
            p2.setRent(14500.0);
            p2.setDeposit(25000.0);
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

            // 3. Bangalore Budget PG (Boys) - ₹7,500
            Property p3 = new Property();
            p3.setName("Stanza Living - Dublin House");
            p3.setDescription("Super neat coliving student PG in Koramangala. Includes 3 meals daily, high-speed Wi-Fi, laundry, biometric entrance control, and recreation area.");
            p3.setCity("Bangalore");
            p3.setArea("Koramangala");
            p3.setRent(7500.0);
            p3.setDeposit(15000.0);
            p3.setRooms(15);
            p3.setRoomTypes(Arrays.asList("Double sharing", "Triple sharing"));
            p3.setAmenities(Arrays.asList("Wi-Fi", "Food", "Security", "Laundry"));
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

            // 4. Bangalore Premium PG (Girls) - ₹12,000
            Property p4 = new Property();
            p4.setName("Zolo Coliving - Indiranagar Suites");
            p4.setDescription("Premium girls coliving suites. Features individual wardrobe spaces, study table setup, AC, common lounge, fully automatic laundry, and 3-tier security guard deployment.");
            p4.setCity("Bangalore");
            p4.setArea("Indiranagar");
            p4.setRent(12000.0);
            p4.setDeposit(24000.0);
            p4.setRooms(8);
            p4.setRoomTypes(Arrays.asList("Single Room", "Double sharing"));
            p4.setAmenities(Arrays.asList("Wi-Fi", "Food", "AC", "Security", "Laundry"));
            p4.setRules(Arrays.asList("Gate closing time at 11 PM", "Quiet hours after 10 PM"));
            p4.setOwnerId("owner1");
            p4.setOwnerName("Praveen Prakash");
            p4.setOwnerPhone("+91 94412 12345");
            p4.setOwnerEmail("praveen.blr@pgmadeeazy.com");
            p4.setCategory("Girls");
            p4.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80"
            ));
            p4.setApprovalStatus(ApprovalStatus.APPROVED);
            p4.setCreatedAt(new Date());
            p4.setUpdatedAt(new Date());
            p4.setApprovedAt(new Date());
            p4.setApprovedBy("admin");
            propertyRepository.save(p4);

            // 5. Chennai Mid-range PG (Girls) - ₹7,200
            Property p5 = new Property();
            p5.setName("Adyar Cozy Nest for Girls");
            p5.setDescription("Highly secure and comfortable girls PG in Adyar. Features clean air-conditioned rooms, healthy meals, study desks, laundry, and fingerprint access gate control.");
            p5.setCity("Chennai");
            p5.setArea("Adyar");
            p5.setRent(7200.0);
            p5.setDeposit(12000.0);
            p5.setRooms(10);
            p5.setRoomTypes(Arrays.asList("Double sharing", "Triple sharing"));
            p5.setAmenities(Arrays.asList("Wi-Fi", "Food", "AC", "Security", "Laundry"));
            p5.setRules(Arrays.asList("Gate closing at 10 PM", "Visitors allowed in lobby only"));
            p5.setOwnerId("owner3");
            p5.setOwnerName("Srinivasan Iyer");
            p5.setOwnerPhone("+91 98840 98840");
            p5.setOwnerEmail("srini@pgmadeeazy.com");
            p5.setCategory("Girls");
            p5.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1626125345510-4603468eedfb?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
            ));
            p5.setApprovalStatus(ApprovalStatus.APPROVED);
            p5.setCreatedAt(new Date());
            p5.setUpdatedAt(new Date());
            p5.setApprovedAt(new Date());
            p5.setApprovedBy("admin");
            propertyRepository.save(p5);

            // 6. Delhi Student PG (Girls) - ₹9,500
            Property p6 = new Property();
            p6.setName("North Campus Elite Girls PG");
            p6.setDescription("Charming, clean girls hostel in North Campus near DU. Features study table, wardrobes, high speed Wi-Fi, central AC, laundry service, and healthy meals thrice a day.");
            p6.setCity("Delhi");
            p6.setArea("Kamla Nagar");
            p6.setRent(9500.0);
            p6.setDeposit(18000.0);
            p6.setRooms(14);
            p6.setRoomTypes(Arrays.asList("Single Room", "Double sharing"));
            p6.setAmenities(Arrays.asList("Wi-Fi", "Food", "AC", "Security", "Laundry"));
            p6.setRules(Arrays.asList("Gate curfew at 9:30 PM", "No alcohol/smoking allowed"));
            p6.setOwnerId("owner4");
            p6.setOwnerName("Vijay Malhotra");
            p6.setOwnerPhone("+91 98110 98110");
            p6.setOwnerEmail("vijay.del@pgmadeeazy.com");
            p6.setCategory("Girls");
            p6.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1626125345510-4603468eedfb?auto=format&fit=crop&w=600&q=80"
            ));
            p6.setApprovalStatus(ApprovalStatus.APPROVED);
            p6.setCreatedAt(new Date());
            p6.setUpdatedAt(new Date());
            p6.setApprovedAt(new Date());
            p6.setApprovedBy("admin");
            propertyRepository.save(p6);

            // 7. Mumbai IT Coliving (Unisex) - ₹18,000
            Property p7 = new Property();
            p7.setName("Bandra Premium Coliving Suites");
            p7.setDescription("Sleek, fully automated co-living apartment space in Bandra West. Ideal for young professionals, offering private desks, smart laundry, high-speed Wi-Fi, Gym, and daily housekeeping.");
            p7.setCity("Mumbai");
            p7.setArea("Bandra West");
            p7.setRent(18000.0);
            p7.setDeposit(40000.0);
            p7.setRooms(8);
            p7.setRoomTypes(Arrays.asList("Single Room", "Double sharing"));
            p7.setAmenities(Arrays.asList("Wi-Fi", "Food", "AC", "Gym", "Security", "Laundry"));
            p7.setRules(Arrays.asList("Respect quiet hours after 10 PM", "Prior approval for guest overnight stays"));
            p7.setOwnerId("owner5");
            p7.setOwnerName("Amit Fernandes");
            p7.setOwnerPhone("+91 98200 12345");
            p7.setOwnerEmail("amit.mum@pgmadeeazy.com");
            p7.setCategory("Unisex");
            p7.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80"
            ));
            p7.setApprovalStatus(ApprovalStatus.APPROVED);
            p7.setCreatedAt(new Date());
            p7.setUpdatedAt(new Date());
            p7.setApprovedAt(new Date());
            p7.setApprovedBy("admin");
            propertyRepository.save(p7);

            // 8. Pune Budget PG (Boys) - ₹5,800
            Property p8 = new Property();
            p8.setName("Hinjewadi Tech Boys PG");
            p8.setDescription("Budget-friendly hostel PG for male IT professionals in Hinjewadi. Features high speed Wi-Fi, hot water facility, clean drinking water, daily cleaning, and simple vegetarian dining.");
            p8.setCity("Pune");
            p8.setArea("Hinjewadi");
            p8.setRent(5800.0);
            p8.setDeposit(10000.0);
            p8.setRooms(20);
            p8.setRoomTypes(Arrays.asList("Double sharing", "Triple sharing"));
            p8.setAmenities(Arrays.asList("Wi-Fi", "Food", "Security", "Laundry", "Parking"));
            p8.setRules(Arrays.asList("No smoking inside", "Quiet hours after 11 PM"));
            p8.setOwnerId("owner6");
            p8.setOwnerName("Sanjay Patil");
            p8.setOwnerPhone("+91 97660 12345");
            p8.setOwnerEmail("sanjay.pune@pgmadeeazy.com");
            p8.setCategory("Boys");
            p8.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1626125345510-4603468eedfb?auto=format&fit=crop&w=600&q=80"
            ));
            p8.setApprovalStatus(ApprovalStatus.APPROVED);
            p8.setCreatedAt(new Date());
            p8.setUpdatedAt(new Date());
            p8.setApprovedAt(new Date());
            p8.setApprovedBy("admin");
            propertyRepository.save(p8);

            // 9. Pune Mid-range PG (Girls) - ₹8,200
            Property p9 = new Property();
            p9.setName("Viman Nagar Cozy Girls PG");
            p9.setDescription("Comfortable girls PG located near Symbiosis. Features fully furnished single and double sharing rooms, CCTV security, laundry services, and home-like buffet meals.");
            p9.setCity("Pune");
            p9.setArea("Viman Nagar");
            p9.setRent(8200.0);
            p9.setDeposit(15000.0);
            p9.setRooms(15);
            p9.setRoomTypes(Arrays.asList("Single Room", "Double sharing"));
            p9.setAmenities(Arrays.asList("Wi-Fi", "Food", "AC", "Security", "Laundry"));
            p9.setRules(Arrays.asList("Curfew at 10:30 PM", "Maintain hygiene in common spaces"));
            p9.setOwnerId("owner7");
            p9.setOwnerName("Manisha Joshi");
            p9.setOwnerPhone("+91 98220 54321");
            p9.setOwnerEmail("manisha.pune@pgmadeeazy.com");
            p9.setCategory("Girls");
            p9.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80"
            ));
            p9.setApprovalStatus(ApprovalStatus.APPROVED);
            p9.setCreatedAt(new Date());
            p9.setUpdatedAt(new Date());
            p9.setApprovedAt(new Date());
            p9.setApprovedBy("admin");
            propertyRepository.save(p9);

            System.out.println("Seeding completed successfully!");
        };
    }
}