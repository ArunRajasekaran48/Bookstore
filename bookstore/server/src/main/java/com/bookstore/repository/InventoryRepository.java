package com.bookstore.repository;

import com.bookstore.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByBookId(Long bookId);

    @Query("SELECT i FROM Inventory i WHERE i.quantityInStock <= i.reorderThreshold")
    List<Inventory> findLowStockInventories();
}
