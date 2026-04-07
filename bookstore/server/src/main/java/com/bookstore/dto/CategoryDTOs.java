package com.bookstore.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class CategoryDTOs {

    @Data
    public static class CategoryRequest {
        @NotBlank
        private String name;
        private String description;
    }

    @Data
    public static class CategoryResponse {
        private Long id;
        private String name;
        private String description;
        private int bookCount;
    }
}
