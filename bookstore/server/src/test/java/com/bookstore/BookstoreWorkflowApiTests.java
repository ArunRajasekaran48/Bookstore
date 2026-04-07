package com.bookstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.bookstore.entity.LowStockAlert;
import com.bookstore.repository.LowStockAlertRepository;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class BookstoreWorkflowApiTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

        @Autowired
        private LowStockAlertRepository lowStockAlertRepository;

    @Test
    @Order(1)
    void loginAndAuthenticationTesting() throws Exception {
        String studentToken = loginAndGetToken("student1", "student123");
        assertThat(studentToken).isNotBlank();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", "student1",
                                "password", "wrong-password"
                        ))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        mockMvc.perform(get("/api/cart")
                        .header("Authorization", bearer(studentToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").exists());
    }

    @Test
    @Order(2)
    void navigationAndUiTesting() throws Exception {
        mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        mockMvc.perform(get("/api/cart"))
                .andExpect(result -> assertThat(result.getResponse().getStatus()).isIn(401, 403));

        String studentToken = loginAndGetToken("student1", "student123");
        mockMvc.perform(get("/api/inventory/alerts")
                        .header("Authorization", bearer(studentToken)))
                .andExpect(status().isForbidden());

        String adminToken = loginAndGetToken("admin", "admin123");
        mockMvc.perform(get("/api/inventory/alerts")
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @Order(3)
    void cartAndOrderTesting() throws Exception {
        String studentToken = loginAndGetToken("student1", "student123");
        Long bookId = fetchFirstBookId();

        MvcResult addToCartResult = mockMvc.perform(post("/api/cart/add")
                        .header("Authorization", bearer(studentToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "bookId", bookId,
                                "quantity", 1
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        JsonNode cartBody = readBody(addToCartResult);
        assertThat(cartBody.path("data").path("totalItems").asInt()).isGreaterThan(0);

        MvcResult placeOrderResult = mockMvc.perform(post("/api/orders/place")
                        .header("Authorization", bearer(studentToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "shippingAddress", "123 College Road, Chennai",
                                "paymentMethod", "CARD",
                                "notes", "JUnit order workflow test"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber").exists())
                .andReturn();

        JsonNode placeOrderBody = readBody(placeOrderResult);
        long orderId = placeOrderBody.path("data").path("id").asLong();
        assertThat(orderId).isPositive();

        MvcResult paymentResult = mockMvc.perform(post("/api/orders/{orderId}/payment", orderId)
                        .header("Authorization", bearer(studentToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "paymentMethod", "CARD",
                                "cardNumber", "4111111111110000",
                                "cardHolderName", "JUnit Tester",
                                "expiryDate", "12/30",
                                "cvv", "123"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.success").value(false))
                .andReturn();

        JsonNode paymentBody = readBody(paymentResult);
        assertThat(paymentBody.path("data").path("message").asText().toLowerCase()).contains("failed");

        MvcResult myOrdersResult = mockMvc.perform(get("/api/orders/my-orders")
                        .header("Authorization", bearer(studentToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        JsonNode myOrders = readBody(myOrdersResult).path("data");
        boolean foundPlacedOrder = false;
        for (JsonNode order : myOrders) {
            if (order.path("id").asLong() == orderId) {
                foundPlacedOrder = true;
                break;
            }
        }
        assertThat(foundPlacedOrder).isTrue();
    }

    @Test
    @Order(4)
    void inventoryAndStockTesting() throws Exception {
        String adminToken = loginAndGetToken("admin", "admin123");
        Long bookId = fetchFirstBookId();

        mockMvc.perform(patch("/api/books/{id}/stock", bookId)
                        .header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "quantity", 0,
                                "reason", "JUnit inventory and stock test"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(bookId))
                .andExpect(jsonPath("$.data.stockQuantity").value(0));

        mockMvc.perform(get("/api/books/{id}", bookId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(bookId))
                .andExpect(jsonPath("$.data.lowStock").value(true));

        mockMvc.perform(post("/api/inventory/sync")
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/books/low-stock")
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        Optional<LowStockAlert> maybeAlert = lowStockAlertRepository.findAll().stream().findFirst();
        if (maybeAlert.isPresent()) {
            long alertId = maybeAlert.get().getId();

            mockMvc.perform(patch("/api/inventory/alerts/{alertId}/acknowledge", alertId)
                            .header("Authorization", bearer(adminToken)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));

            mockMvc.perform(patch("/api/inventory/alerts/{alertId}/resolve", alertId)
                            .header("Authorization", bearer(adminToken)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }

        mockMvc.perform(get("/api/inventory/alerts/all")
                        .header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk());
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private String loginAndGetToken(String username, String password) throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", username,
                                "password", password
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        String token = readBody(loginResult).path("data").path("token").asText();
        assertThat(token).isNotBlank();
        return token;
    }

    private Long fetchFirstBookId() throws Exception {
        MvcResult booksResult = mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andReturn();

        JsonNode books = readBody(booksResult).path("data");
        assertThat(books.isArray()).isTrue();
        assertThat(books.size()).isGreaterThan(0);
        return books.get(0).path("id").asLong();
    }

    private JsonNode readBody(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }
}
