package com.bookstore.service;

import com.bookstore.dto.CartOrderDTOs.*;

public interface CartService {
    CartResponse getCart(Long userId);
    CartResponse addToCart(Long userId, AddToCartRequest request);
    CartResponse updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request);
    CartResponse removeFromCart(Long userId, Long itemId);
    void clearCart(Long userId);
}
