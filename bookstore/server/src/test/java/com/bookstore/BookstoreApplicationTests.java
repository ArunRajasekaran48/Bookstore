package com.bookstore;

import com.bookstore.repository.*;
import com.bookstore.service.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class BookstoreApplicationTests {

    @Autowired private BookService bookService;
    @Autowired private CategoryService categoryService;
    @Autowired private CartService cartService;
    @Autowired private OrderService orderService;
    @Autowired private InventoryService inventoryService;
    @Autowired private BookRepository bookRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private InventoryRepository inventoryRepository;

    @Test
    void contextLoads() {
        // Verifies the Spring context starts up correctly with all beans wired
        assertThat(bookService).isNotNull();
        assertThat(categoryService).isNotNull();
        assertThat(cartService).isNotNull();
        assertThat(orderService).isNotNull();
        assertThat(inventoryService).isNotNull();
    }

    @Test
    void repositoriesLoad() {
        assertThat(bookRepository).isNotNull();
        assertThat(userRepository).isNotNull();
        assertThat(inventoryRepository).isNotNull();
    }

    @Test
    void getAllBooksReturnsResult() {
        var books = bookService.getAllBooks();
        // After DataSeeder runs, should have 12 books seeded
        assertThat(books).isNotNull();
    }

    @Test
    void getAllCategoriesReturnsResult() {
        var categories = categoryService.getAllCategories();
        assertThat(categories).isNotNull();
    }

    @Test
    void getLowStockBooksReturnsResult() {
        var lowStock = bookService.getLowStockBooks();
        assertThat(lowStock).isNotNull();
    }

    @Test
    void inventoryAlertsCanBeRetrieved() {
        var alerts = inventoryService.getAllAlerts();
        assertThat(alerts).isNotNull();
    }
}
