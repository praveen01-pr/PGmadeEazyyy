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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Random;

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
            System.out.println("Refreshing and seeding database with 25+ Hyderabad hostels...");
            propertyRepository.deleteAll();

            // Seed other major cities properties
            // 1. Bangalore Budget PG (Boys) - ₹7,500
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

            // 2. Bangalore Premium PG (Girls) - ₹12,000
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

            // 3. Chennai Mid-range PG (Girls) - ₹7,200
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

            // 4. Delhi Student PG (Girls) - ₹9,500
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

            // Programmatically generate 25 properties in Hyderabad
            List<String> hyderabadAreas = Arrays.asList("Gachibowli", "Madhapur", "Kondapur", "Jubilee Hills", "Banjara Hills", "Ameerpet", "Kukatpally");
            List<String> pgBrands = Arrays.asList("OYO Life", "Stanza Living", "Zolo Stay", "Coho Coliving", "Isthara House", "Boston Coliving", "Boston Premium");
            List<String> pgNames = Arrays.asList("Elite House", "Comfort Nest", "Premium Suites", "Luxury Haven", "Executive Stay", "Standard Lodge", "Orchid Retreat", "Castle Stay", "Grand Coliving");
            List<String> categories = Arrays.asList("Boys", "Girls", "Unisex");
            
            List<List<String>> unsplashImages = Arrays.asList(
                Arrays.asList("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1626125345510-4603468eedfb?auto=format&fit=crop&w=600&q=80"),
                Arrays.asList("https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"),
                Arrays.asList("https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80"),
                Arrays.asList("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80")
            );

            Random rand = new Random();

            for (int i = 1; i <= 25; i++) {
                Property p = new Property();
                String area = hyderabadAreas.get(rand.nextInt(hyderabadAreas.size()));
                String brand = pgBrands.get(rand.nextInt(pgBrands.size()));
                String nameSuffix = pgNames.get(rand.nextInt(pgNames.size()));
                String category = categories.get(rand.nextInt(categories.size()));
                
                p.setName(brand + " - " + nameSuffix + " " + (100 + i));
                p.setDescription("Fully managed, modern " + category.toLowerCase() + " PG hostel located in the prime hub of " + area + ", Hyderabad. Rent includes high-speed Wi-Fi, laundry service, CCTV security, daily cleaning, and healthy meals.");
                p.setCity("Hyderabad");
                p.setArea(area);
                
                // Rent between 5200 and 17500
                double rent = 5200 + rand.nextInt(124) * 100;
                p.setRent(rent);
                p.setDeposit(rent * 2);
                
                p.setRooms(5 + rand.nextInt(15));
                p.setRoomTypes(Arrays.asList("Single Room", "Double sharing", "Triple sharing"));
                p.setAmenities(Arrays.asList("Wi-Fi", "Food", "AC", "Security", "Laundry", "Power Backup"));
                p.setRules(Arrays.asList("Gate closes at 10:30 PM", "No alcohol/smoking inside rooms"));
                p.setOwnerId("owner_hyd_" + i);
                p.setOwnerName("Hyderabad Host " + i);
                p.setOwnerPhone("+91 90000 " + (10000 + rand.nextInt(90000)));
                p.setOwnerEmail("owner.hyd" + i + "@pgmadeeazy.com");
                p.setCategory(category);
                p.setImages(unsplashImages.get(rand.nextInt(unsplashImages.size())));
                
                p.setApprovalStatus(ApprovalStatus.APPROVED);
                p.setCreatedAt(new Date());
                p.setUpdatedAt(new Date());
                p.setApprovedAt(new Date());
                p.setApprovedBy("admin");
                
                propertyRepository.save(p);
            }

            System.out.println("25+ Hyderabad hostels successfully seeded!");
        };
    }
}