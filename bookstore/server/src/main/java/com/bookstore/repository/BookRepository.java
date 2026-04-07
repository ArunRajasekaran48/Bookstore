package com.bookstore.repository;

import com.bookstore.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByCategoryIdAndActiveTrue(Long categoryId);
    List<Book> findByActiveTrue();
    Optional<Book> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);

    @Query("SELECT b FROM Book b WHERE b.active = true AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Book> searchBooks(@Param("keyword") String keyword);

    @Query("SELECT b FROM Book b JOIN b.inventory i WHERE i.quantityInStock <= i.reorderThreshold AND b.active = true")
    List<Book> findLowStockBooks();
}
