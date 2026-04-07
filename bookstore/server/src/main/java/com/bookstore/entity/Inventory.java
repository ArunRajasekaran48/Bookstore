package com.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false, unique = true)
    private Book book;

    @Column(name = "quantity_in_stock", nullable = false)
    private Integer quantityInStock;

    @Column(name = "quantity_reserved")
    private Integer quantityReserved = 0;

    @Column(name = "reorder_threshold", nullable = false)
    private Integer reorderThreshold = 5;

    @Column(name = "last_restocked_at")
    private LocalDateTime lastRestockedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "low_stock_alert_sent")
    private boolean lowStockAlertSent = false;

    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isLowStock() {
        return quantityInStock <= reorderThreshold;
    }

    public int getAvailableQuantity() {
        return quantityInStock - (quantityReserved != null ? quantityReserved : 0);
    }
}
