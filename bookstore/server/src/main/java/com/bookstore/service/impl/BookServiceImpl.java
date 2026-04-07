package com.bookstore.service.impl;

import com.bookstore.dto.BookDTOs.*;
import com.bookstore.entity.*;
import com.bookstore.exception.*;
import com.bookstore.repository.*;
import com.bookstore.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;

    @Override
    public List<BookResponse> getAllBooks() {
        return bookRepository.findByActiveTrue().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<BookResponse> getBooksByCategory(Long categoryId) {
        return bookRepository.findByCategoryIdAndActiveTrue(categoryId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<BookResponse> searchBooks(String keyword) {
        return bookRepository.searchBooks(keyword).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", id));
        return toResponse(book);
    }

    @Override
    @Transactional
    public BookResponse createBook(BookRequest request) {
        if (request.getIsbn() != null && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new BadRequestException("Book with ISBN " + request.getIsbn() + " already exists");
        }
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .description(request.getDescription())
                .price(request.getPrice())
                .coverImageUrl(request.getCoverImageUrl())
                .publisher(request.getPublisher())
                .publicationYear(request.getPublicationYear())
                .language(request.getLanguage())
                .pageCount(request.getPageCount())
                .category(category)
                .active(true)
                .build();
        book = bookRepository.save(book);

        Inventory inventory = Inventory.builder()
                .book(book)
                .quantityInStock(request.getInitialStock())
                .quantityReserved(0)
                .reorderThreshold(request.getReorderThreshold() != null ? request.getReorderThreshold() : 5)
                .lastRestockedAt(LocalDateTime.now())
                .build();
        inventoryRepository.save(inventory);

        return toResponse(book);
    }

    @Override
    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", id));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setCoverImageUrl(request.getCoverImageUrl());
        book.setPublisher(request.getPublisher());
        book.setPublicationYear(request.getPublicationYear());
        book.setLanguage(request.getLanguage());
        book.setPageCount(request.getPageCount());
        book.setCategory(category);

        return toResponse(bookRepository.save(book));
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", id));
        book.setActive(false);
        bookRepository.save(book);
    }

    @Override
    @Transactional
    public BookResponse updateStock(Long id, StockUpdateRequest request) {
        Inventory inventory = inventoryRepository.findByBookId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory for book", id));
        inventory.setQuantityInStock(request.getQuantity());
        inventory.setLastRestockedAt(LocalDateTime.now());
        inventory.setLowStockAlertSent(false);
        inventoryRepository.save(inventory);
        return toResponse(inventory.getBook());
    }

    @Override
    public List<BookResponse> getLowStockBooks() {
        return bookRepository.findLowStockBooks().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public BookResponse toResponse(Book book) {
        BookResponse resp = new BookResponse();
        resp.setId(book.getId());
        resp.setTitle(book.getTitle());
        resp.setAuthor(book.getAuthor());
        resp.setIsbn(book.getIsbn());
        resp.setDescription(book.getDescription());
        resp.setPrice(book.getPrice());
        resp.setCoverImageUrl(book.getCoverImageUrl());
        resp.setPublisher(book.getPublisher());
        resp.setPublicationYear(book.getPublicationYear());
        resp.setLanguage(book.getLanguage());
        resp.setPageCount(book.getPageCount());
        resp.setActive(book.isActive());
        if (book.getCategory() != null) {
            resp.setCategoryId(book.getCategory().getId());
            resp.setCategoryName(book.getCategory().getName());
        }
        Inventory inv = book.getInventory();
        if (inv != null) {
            resp.setStockQuantity(inv.getQuantityInStock());
            resp.setReorderThreshold(inv.getReorderThreshold());
            resp.setLowStock(inv.isLowStock());
        }
        return resp;
    }
}
