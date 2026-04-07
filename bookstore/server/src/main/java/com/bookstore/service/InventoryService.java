package com.bookstore.service;

import com.bookstore.entity.Inventory;
import com.bookstore.entity.LowStockAlert;
import java.util.List;

public interface InventoryService {
    void deductStock(Long bookId, int quantity);
    void checkAndTriggerLowStockAlerts();
    List<LowStockAlert> getActiveAlerts();
    List<LowStockAlert> getAllAlerts();
    void acknowledgeAlert(Long alertId);
    void resolveAlert(Long alertId);
}
