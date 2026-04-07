package com.bookstore.repository;

import com.bookstore.entity.LowStockAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LowStockAlertRepository extends JpaRepository<LowStockAlert, Long> {
    List<LowStockAlert> findByStatusOrderByTriggeredAtDesc(LowStockAlert.AlertStatus status);
    List<LowStockAlert> findAllByOrderByTriggeredAtDesc();
    boolean existsByBookIdAndStatus(Long bookId, LowStockAlert.AlertStatus status);
}
