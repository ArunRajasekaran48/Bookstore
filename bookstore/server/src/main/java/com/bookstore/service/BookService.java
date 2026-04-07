package com.bookstore.service;

import com.bookstore.dto.BookDTOs.*;
import java.util.List;

public interface BookService {
    List<BookResponse> getAllBooks();
    List<BookResponse> getBooksByCategory(Long categoryId);
    List<BookResponse> searchBooks(String keyword);
    BookResponse getBookById(Long id);
    BookResponse createBook(BookRequest request);
    BookResponse updateBook(Long id, BookRequest request);
    void deleteBook(Long id);
    BookResponse updateStock(Long id, StockUpdateRequest request);
    List<BookResponse> getLowStockBooks();
}
