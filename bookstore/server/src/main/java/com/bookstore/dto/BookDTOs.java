package com.bookstore.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

public class BookDTOs {

    @Data
    public static class BookRequest {
        @NotBlank
        private String title;

        @NotBlank
        private String author;

        private String isbn;
        private String description;

        @NotNull
        @DecimalMin("0.01")
        private BigDecimal price;

        private String coverImageUrl;
        private String publisher;
        private Integer publicationYear;
        private String language;
        private Integer pageCount;

        @NotNull
        private Long categoryId;

        @NotNull
        @Min(0)
        private Integer initialStock;

        @Min(1)
        private Integer reorderThreshold = 5;
    }

    @Data
    public static class BookResponse {
        private Long id;
        private String title;
        private String author;
        private String isbn;
        private String description;
        private BigDecimal price;
        private String coverImageUrl;
        private String publisher;
        private Integer publicationYear;
        private String language;
        private Integer pageCount;
        private Long categoryId;
        private String categoryName;
        private Integer stockQuantity;
        private Integer reorderThreshold;
        private boolean lowStock;
        private boolean active;
    }

    @Data
    public static class StockUpdateRequest {
        @NotNull
        @Min(0)
        private Integer quantity;
        private String reason;
    }
}
