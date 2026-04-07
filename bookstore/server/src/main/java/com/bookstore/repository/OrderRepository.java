package com.bookstore.repository;

import com.bookstore.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderedAtDesc(Long userId);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findAllByOrderByOrderedAtDesc();
}
