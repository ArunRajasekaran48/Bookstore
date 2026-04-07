package com.bookstore.service;

import com.bookstore.dto.CartOrderDTOs.*;
import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(Long userId, PlaceOrderRequest request);
    PaymentResponse processPayment(Long orderId, PaymentRequest request);
    List<OrderResponse> getUserOrders(Long userId);
    OrderResponse getOrderById(Long orderId);
    List<OrderResponse> getAllOrders();
    OrderResponse updateOrderStatus(Long orderId, String status);
}
