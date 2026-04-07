package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.CartOrderDTOs.*;
import com.bookstore.security.UserDetailsImpl;
import com.bookstore.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @AuthenticationPrincipal UserDetailsImpl user,
            @Valid @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully",
                orderService.placeOrder(user.getId(), request)));
    }

    @PostMapping("/{orderId}/payment")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(
            @PathVariable Long orderId,
            @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.processPayment(orderId, request)));
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getUserOrders(user.getId())));
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(orderId)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders()));
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Order status updated",
                orderService.updateOrderStatus(orderId, status)));
    }
}
