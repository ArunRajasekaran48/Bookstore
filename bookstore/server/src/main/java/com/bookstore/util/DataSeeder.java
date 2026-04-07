package com.bookstore.util;

import com.bookstore.entity.*;
import com.bookstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final InventoryRepository inventoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Data already seeded. Skipping...");
            return;
        }
        log.info("Seeding initial data...");
        seedUsers();
        seedCategories();
        seedBooks();
        log.info("Data seeding complete.");
    }

    private void seedUsers() {
        User admin = User.builder()
                .username("admin")
                .email("admin@bookstore.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Store Administrator")
                .phone("9876543210")
                .role(User.Role.ADMIN)
                .active(true)
                .build();

        User student = User.builder()
                .username("student1")
                .email("student1@sece.ac.in")
                .password(passwordEncoder.encode("student123"))
                .fullName("Arun Kumar")
                .phone("9876500001")
                .role(User.Role.STUDENT)
                .active(true)
                .build();

        userRepository.saveAll(List.of(admin, student));
        log.info("Seeded 2 users (admin / student1)");
    }

    private void seedCategories() {
        List<Category> categories = List.of(
            Category.builder().name("Computer Science").description("Programming, algorithms, and software engineering books").build(),
            Category.builder().name("Mathematics").description("Pure and applied mathematics textbooks").build(),
            Category.builder().name("Physics").description("Classical and modern physics textbooks").build(),
            Category.builder().name("Engineering").description("Mechanical, electrical, and civil engineering books").build(),
            Category.builder().name("Literature").description("Fiction, poetry, and classic literature").build(),
            Category.builder().name("Business").description("Management, finance, and entrepreneurship books").build()
        );
        categoryRepository.saveAll(categories);
        log.info("Seeded 6 categories");
    }

    private void seedBooks() {
        Category cs = categoryRepository.findByName("Computer Science").orElseThrow();
        Category math = categoryRepository.findByName("Mathematics").orElseThrow();
        Category physics = categoryRepository.findByName("Physics").orElseThrow();
        Category eng = categoryRepository.findByName("Engineering").orElseThrow();
        Category lit = categoryRepository.findByName("Literature").orElseThrow();
        Category biz = categoryRepository.findByName("Business").orElseThrow();

        List<Object[]> bookData = List.of(
            new Object[]{"Clean Code", "Robert C. Martin", "9780132350884", "A handbook of agile software craftsmanship", new BigDecimal("599.00"), cs, 25, 5, "https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg"},
            new Object[]{"Introduction to Algorithms", "Thomas H. Cormen", "9780262033848", "Comprehensive textbook on algorithms", new BigDecimal("1299.00"), cs, 15, 5, "https://covers.openlibrary.org/b/isbn/9780262033848-M.jpg"},
            new Object[]{"The Pragmatic Programmer", "Andrew Hunt", "9780201616224", "From journeyman to master", new BigDecimal("749.00"), cs, 8, 5, "https://covers.openlibrary.org/b/isbn/9780201616224-M.jpg"},
            new Object[]{"Design Patterns", "Gang of Four", "9780201633610", "Elements of reusable object-oriented software", new BigDecimal("899.00"), cs, 4, 5, "https://covers.openlibrary.org/b/isbn/9780201633610-M.jpg"},
            new Object[]{"Calculus: Early Transcendentals", "James Stewart", "9781285741550", "Classic calculus textbook for engineering students", new BigDecimal("1099.00"), math, 20, 5, "https://covers.openlibrary.org/b/isbn/9781285741550-M.jpg"},
            new Object[]{"Linear Algebra and Its Applications", "Gilbert Strang", "9780030105678", "Comprehensive linear algebra reference", new BigDecimal("849.00"), math, 3, 5, "https://covers.openlibrary.org/b/isbn/9780030105678-M.jpg"},
            new Object[]{"University Physics", "Young & Freedman", "9780133969290", "Standard university physics textbook", new BigDecimal("1199.00"), physics, 18, 5, "https://covers.openlibrary.org/b/isbn/9780133969290-M.jpg"},
            new Object[]{"Concepts of Physics", "H.C. Verma", "9788177091878", "Popular physics book for competitive exams", new BigDecimal("449.00"), physics, 2, 5, "https://covers.openlibrary.org/b/isbn/9788177091878-M.jpg"},
            new Object[]{"Strength of Materials", "R.K. Bansal", "9788131808146", "Essential civil engineering reference", new BigDecimal("599.00"), eng, 12, 5, "https://covers.openlibrary.org/b/isbn/9788131808146-M.jpg"},
            new Object[]{"To Kill a Mockingbird", "Harper Lee", "9780061935466", "A classic of modern American literature", new BigDecimal("349.00"), lit, 30, 5, "https://covers.openlibrary.org/b/isbn/9780061935466-M.jpg"},
            new Object[]{"The Great Gatsby", "F. Scott Fitzgerald", "9780743273565", "The story of the fabulously wealthy Jay Gatsby", new BigDecimal("299.00"), lit, 25, 5, "https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg"},
            new Object[]{"Zero to One", "Peter Thiel", "9780804139021", "Notes on startups, or how to build the future", new BigDecimal("499.00"), biz, 10, 5, "https://covers.openlibrary.org/b/isbn/9780804139021-M.jpg"}
        );

        for (Object[] data : bookData) {
            Book book = Book.builder()
                    .title((String) data[0])
                    .author((String) data[1])
                    .isbn((String) data[2])
                    .description((String) data[3])
                    .price((BigDecimal) data[4])
                    .category((Category) data[5])
                    .coverImageUrl((String) data[8])
                    .language("English")
                    .active(true)
                    .build();
            book = bookRepository.save(book);

            Inventory inv = Inventory.builder()
                    .book(book)
                    .quantityInStock((Integer) data[6])
                    .quantityReserved(0)
                    .reorderThreshold((Integer) data[7])
                    .lastRestockedAt(LocalDateTime.now())
                    .build();
            inventoryRepository.save(inv);
        }
        log.info("Seeded 12 books with inventory");
    }
}
