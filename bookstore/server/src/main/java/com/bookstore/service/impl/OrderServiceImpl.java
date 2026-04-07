package com.bookstore.service.impl;

import com.bookstore.dto.CartOrderDTOs.*;
import com.bookstore.entity.*;
import com.bookstore.exception.*;
import com.bookstore.repository.*;
import com.bookstore.service.InventoryService;
import com.bookstore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryService inventoryService;

    @Override
    @Transactional
    public OrderResponse placeOrder(Long userId, PlaceOrderRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with empty cart");
        }

        // Validate stock for all items
        for (CartItem item : cart.getItems()) {
            Inventory inv = inventoryRepository.findByBookId(item.getBook().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory for book", item.getBook().getId()));
            if (inv.getAvailableQuantity() < item.getQuantity()) {
                throw new InsufficientStockException(
                        "Insufficient stock for: " + item.getBook().getTitle() +
                        ". Available: " + inv.getAvailableQuantity());
            }
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        // Create order
        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + userId;
        BigDecimal total = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .status(Order.OrderStatus.PENDING)
                .paymentStatus(Order.PaymentStatus.PENDING)
                .totalAmount(total)
                .paymentMethod(request.getPaymentMethod())
                .shippingAddress(request.getShippingAddress())
                .notes(request.getNotes())
                .build();

        order = orderRepository.save(order);

        // Create order items
        Order finalOrder = order;
        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem oi = OrderItem.builder()
                    .order(finalOrder)
                    .book(cartItem.getBook())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .build();
            return oi;
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        order = orderRepository.save(order);

        return toResponse(order);
    }

    @Override
    @Transactional
    public PaymentResponse processPayment(Long orderId, PaymentRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (!order.getPaymentStatus().equals(Order.PaymentStatus.PENDING)) {
            throw new BadRequestException("Payment already processed for this order");
        }

        // Mock payment processing - 90% success rate
        boolean paymentSuccess = simulatePayment(request);
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setOrderNumber(order.getOrderNumber());
        paymentResponse.setAmount(order.getTotalAmount());
        paymentResponse.setTransactionId(transactionId);

        if (paymentSuccess) {
            order.setPaymentStatus(Order.PaymentStatus.SUCCESS);
            order.setPaymentReference(transactionId);
            order.setStatus(Order.OrderStatus.CONFIRMED);

            // Deduct stock
            for (OrderItem item : order.getItems()) {
                inventoryService.deductStock(item.getBook().getId(), item.getQuantity());
            }

            // Clear cart
            cartRepository.findByUserId(order.getUser().getId()).ifPresent(cart -> {
                cart.getItems().clear();
                cartItemRepository.deleteByCartId(cart.getId());
                cartRepository.save(cart);
            });

            paymentResponse.setSuccess(true);
            paymentResponse.setMessage("Payment successful! Your order has been confirmed.");
        } else {
            order.setPaymentStatus(Order.PaymentStatus.FAILED);
            order.setStatus(Order.OrderStatus.CANCELLED);
            paymentResponse.setSuccess(false);
            paymentResponse.setMessage("Payment failed. Please try again or use a different payment method.");
        }

        orderRepository.save(order);
        return paymentResponse;
    }

    private boolean simulatePayment(PaymentRequest request) {
        // Simulate payment failures for specific test cases
        if (request.getCardNumber() != null && request.getCardNumber().endsWith("0000")) {
            return false; // Always fail for test card
        }
        // 90% success rate
        return new Random().nextInt(10) != 0;
    }

    @Override
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByOrderedAtDesc(userId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        return toResponse(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderedAtDesc().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse resp = new OrderResponse();
        resp.setId(order.getId());
        resp.setOrderNumber(order.getOrderNumber());
        resp.setStatus(order.getStatus().name());
        resp.setPaymentStatus(order.getPaymentStatus().name());
        resp.setPaymentMethod(order.getPaymentMethod());
        resp.setTotalAmount(order.getTotalAmount());
        resp.setShippingAddress(order.getShippingAddress());
        resp.setOrderedAt(order.getOrderedAt());
        resp.setNotes(order.getNotes());

        if (order.getItems() != null) {
            List<OrderItemResponse> items = order.getItems().stream().map(item -> {
                OrderItemResponse ir = new OrderItemResponse();
                ir.setId(item.getId());
                ir.setBookId(item.getBook().getId());
                ir.setBookTitle(item.getBook().getTitle());
                ir.setBookAuthor(item.getBook().getAuthor());
                ir.setCoverImageUrl(item.getBook().getCoverImageUrl());
                ir.setQuantity(item.getQuantity());
                ir.setUnitPrice(item.getUnitPrice());
                ir.setSubtotal(item.getSubtotal());
                return ir;
            }).collect(Collectors.toList());
            resp.setItems(items);
        }
        return resp;
    }
}
