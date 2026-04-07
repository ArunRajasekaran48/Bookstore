package com.bookstore.util;

import com.bookstore.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InventoryScheduler {

    private static final Logger log = LoggerFactory.getLogger(InventoryScheduler.class);
    private final InventoryService inventoryService;

    // Run every hour
    @Scheduled(cron = "${app.scheduling.inventory-sync-cron}")
    public void syncInventoryAndCheckAlerts() {
        log.info("=== Starting scheduled inventory synchronization ===");
        try {
            inventoryService.checkAndTriggerLowStockAlerts();
            log.info("=== Inventory synchronization completed successfully ===");
        } catch (Exception e) {
            log.error("Error during inventory synchronization: {}", e.getMessage(), e);
        }
    }

    // Also run 1 minute after startup for immediate check
    @Scheduled(initialDelay = 60000, fixedDelay = Long.MAX_VALUE)
    public void initialInventoryCheck() {
        log.info("=== Running initial inventory check ===");
        try {
            inventoryService.checkAndTriggerLowStockAlerts();
        } catch (Exception e) {
            log.error("Error during initial inventory check: {}", e.getMessage(), e);
        }
    }
}
