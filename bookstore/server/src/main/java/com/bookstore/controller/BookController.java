package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.BookDTOs.*;
import com.bookstore.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookResponse>>> getAllBooks() {
        return ResponseEntity.ok(ApiResponse.success(bookService.getAllBooks()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookResponse>> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(bookService.getBookById(id)));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getBooksByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(ApiResponse.success(bookService.getBooksByCategory(categoryId)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<BookResponse>>> searchBooks(@RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.success(bookService.searchBooks(keyword)));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getLowStockBooks() {
        return ResponseEntity.ok(ApiResponse.success(bookService.getLowStockBooks()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookResponse>> createBook(@Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Book created successfully", bookService.createBook(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookResponse>> updateBook(@PathVariable Long id,
                                                                @Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Book updated successfully", bookService.updateBook(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(ApiResponse.success("Book deleted successfully", null));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookResponse>> updateStock(@PathVariable Long id,
                                                                  @Valid @RequestBody StockUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Stock updated", bookService.updateStock(id, request)));
    }
}
