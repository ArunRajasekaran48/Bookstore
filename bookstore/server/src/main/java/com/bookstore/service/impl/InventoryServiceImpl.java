package com.bookstore.service.impl;

import com.bookstore.entity.*;
import com.bookstore.exception.*;
import com.bookstore.repository.*;
import com.bookstore.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryServiceImpl.class);

    private final InventoryRepository inventoryRepository;
    private final LowStockAlertRepository alertRepository;

    @Override
    @Transactional
    public void deductStock(Long bookId, int quantity) {
        Inventory inventory = inventoryRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory for book", bookId));

        if (inventory.getQuantityInStock() < quantity) {
            throw new InsufficientStockException("Insufficient stock for book id: " + bookId);
        }

        inventory.setQuantityInStock(inventory.getQuantityInStock() - quantity);
        inventoryRepository.save(inventory);

        // Check low stock after deduction
        if (inventory.isLowStock() && !inventory.isLowStockAlertSent()) {
            triggerLowStockAlert(inventory);
            inventory.setLowStockAlertSent(true);
            inventoryRepository.save(inventory);
        }
    }

    @Override
    @Transactional
    public void checkAndTriggerLowStockAlerts() {
        List<Inventory> lowStockItems = inventoryRepository.findLowStockInventories();
        log.info("Inventory sync: checking {} low-stock items", lowStockItems.size());

        for (Inventory inv : lowStockItems) {
            boolean alertExists = alertRepository.existsByBookIdAndStatus(
                    inv.getBook().getId(), LowStockAlert.AlertStatus.ACTIVE);

            if (!alertExists) {
                triggerLowStockAlert(inv);
            }
        }
    }

    private void triggerLowStockAlert(Inventory inventory) {
        LowStockAlert alert = LowStockAlert.builder()
                .book(inventory.getBook())
                .stockLevel(inventory.getQuantityInStock())
                .threshold(inventory.getReorderThreshold())
                .status(LowStockAlert.AlertStatus.ACTIVE)
                .message("Low stock alert: '" + inventory.getBook().getTitle() +
                         "' has only " + inventory.getQuantityInStock() +
                         " copies left (threshold: " + inventory.getReorderThreshold() + ")")
                .build();
        alertRepository.save(alert);
        log.warn("LOW STOCK ALERT: {} - {} copies remaining", inventory.getBook().getTitle(),
                inventory.getQuantityInStock());
    }

    @Override
    public List<LowStockAlert> getActiveAlerts() {
        return alertRepository.findByStatusOrderByTriggeredAtDesc(LowStockAlert.AlertStatus.ACTIVE);
    }

    @Override
    public List<LowStockAlert> getAllAlerts() {
        return alertRepository.findAllByOrderByTriggeredAtDesc();
    }

    @Override
    @Transactional
    public void acknowledgeAlert(Long alertId) {
        LowStockAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", alertId));
        alert.setStatus(LowStockAlert.AlertStatus.ACKNOWLEDGED);
        alertRepository.save(alert);
    }

    @Override
    @Transactional
    public void resolveAlert(Long alertId) {
        LowStockAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", alertId));
        alert.setStatus(LowStockAlert.AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());
        alertRepository.save(alert);
    }
}
