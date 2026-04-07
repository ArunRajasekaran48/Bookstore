package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.entity.LowStockAlert;
import com.bookstore.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<LowStockAlert>>> getActiveAlerts() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getActiveAlerts()));
    }

    @GetMapping("/alerts/all")
    public ResponseEntity<ApiResponse<List<LowStockAlert>>> getAllAlerts() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAllAlerts()));
    }

    @PatchMapping("/alerts/{alertId}/acknowledge")
    public ResponseEntity<ApiResponse<Void>> acknowledgeAlert(@PathVariable Long alertId) {
        inventoryService.acknowledgeAlert(alertId);
        return ResponseEntity.ok(ApiResponse.success("Alert acknowledged", null));
    }

    @PatchMapping("/alerts/{alertId}/resolve")
    public ResponseEntity<ApiResponse<Void>> resolveAlert(@PathVariable Long alertId) {
        inventoryService.resolveAlert(alertId);
        return ResponseEntity.ok(ApiResponse.success("Alert resolved", null));
    }

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<Void>> triggerSync() {
        inventoryService.checkAndTriggerLowStockAlerts();
        return ResponseEntity.ok(ApiResponse.success("Inventory sync triggered", null));
    }
}
