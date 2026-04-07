package com.bookstore.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CartOrderDTOs {

    @Data
    public static class AddToCartRequest {
        @NotNull
        private Long bookId;

        @NotNull
        @Min(1)
        private Integer quantity;
    }

    @Data
    public static class UpdateCartItemRequest {
        @NotNull
        @Min(0)
        private Integer quantity;
    }

    @Data
    public static class CartItemResponse {
        private Long id;
        private Long bookId;
        private String bookTitle;
        private String bookAuthor;
        private String coverImageUrl;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
        private Integer availableStock;
    }

    @Data
    public static class CartResponse {
        private Long id;
        private List<CartItemResponse> items;
        private BigDecimal totalAmount;
        private int totalItems;
    }

    @Data
    public static class PlaceOrderRequest {
        @NotBlank
        private String shippingAddress;

        @NotBlank
        private String paymentMethod;

        private String notes;
    }

    @Data
    public static class PaymentRequest {
        @NotBlank
        private String paymentMethod;

        private String cardNumber;
        private String cardHolderName;
        private String expiryDate;
        private String cvv;

        // UPI
        private String upiId;

        // NetBanking
        private String bankName;
    }

    @Data
    public static class OrderItemResponse {
        private Long id;
        private Long bookId;
        private String bookTitle;
        private String bookAuthor;
        private String coverImageUrl;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }

    @Data
    public static class OrderResponse {
        private Long id;
        private String orderNumber;
        private String status;
        private String paymentStatus;
        private String paymentMethod;
        private BigDecimal totalAmount;
        private String shippingAddress;
        private List<OrderItemResponse> items;
        private LocalDateTime orderedAt;
        private String notes;
    }

    @Data
    public static class PaymentResponse {
        private boolean success;
        private String message;
        private String transactionId;
        private String orderNumber;
        private BigDecimal amount;
    }
}
