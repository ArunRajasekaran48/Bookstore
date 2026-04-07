package com.bookstore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "low_stock_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LowStockAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "stock_level", nullable = false)
    private Integer stockLevel;

    @Column(name = "threshold", nullable = false)
    private Integer threshold;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AlertStatus status;

    @Column(name = "triggered_at", nullable = false)
    private LocalDateTime triggeredAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(length = 500)
    private String message;

    @PrePersist
    protected void onCreate() {
        triggeredAt = LocalDateTime.now();
    }

    public enum AlertStatus {
        ACTIVE, RESOLVED, ACKNOWLEDGED
    }
}
