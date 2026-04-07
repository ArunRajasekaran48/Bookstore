package com.bookstore.service.impl;

import com.bookstore.dto.CartOrderDTOs.*;
import com.bookstore.entity.*;
import com.bookstore.exception.*;
import com.bookstore.repository.*;
import com.bookstore.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;

    @Override
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book", request.getBookId()));

        Inventory inventory = inventoryRepository.findByBookId(book.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory for book", book.getId()));

        if (inventory.getAvailableQuantity() < request.getQuantity()) {
            throw new InsufficientStockException("Only " + inventory.getAvailableQuantity() + " copies available");
        }

        CartItem existingItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), book.getId())
                .orElse(null);

        if (existingItem != null) {
            int newQty = existingItem.getQuantity() + request.getQuantity();
            if (inventory.getAvailableQuantity() < newQty) {
                throw new InsufficientStockException("Cannot add more. Only " + inventory.getAvailableQuantity() + " copies available");
            }
            existingItem.setQuantity(newQty);
            cartItemRepository.save(existingItem);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .book(book)
                    .quantity(request.getQuantity())
                    .unitPrice(book.getPrice())
                    .build();
            cart.getItems().add(item);
            cartItemRepository.save(item);
        }

        cart = cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", itemId));

        if (request.getQuantity() == 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            Inventory inventory = inventoryRepository.findByBookId(item.getBook().getId()).orElseThrow();
            if (inventory.getAvailableQuantity() < request.getQuantity()) {
                throw new InsufficientStockException("Only " + inventory.getAvailableQuantity() + " copies available");
            }
            item.setQuantity(request.getQuantity());
            cartItemRepository.save(item);
        }

        cart = cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeFromCart(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", itemId));
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cart = cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            Cart cart = Cart.builder().user(user).build();
            return cartRepository.save(cart);
        });
    }

    private CartResponse toResponse(Cart cart) {
        CartResponse resp = new CartResponse();
        resp.setId(cart.getId());

        List<CartItemResponse> items = cart.getItems().stream().map(item -> {
            CartItemResponse ir = new CartItemResponse();
            ir.setId(item.getId());
            ir.setBookId(item.getBook().getId());
            ir.setBookTitle(item.getBook().getTitle());
            ir.setBookAuthor(item.getBook().getAuthor());
            ir.setCoverImageUrl(item.getBook().getCoverImageUrl());
            ir.setQuantity(item.getQuantity());
            ir.setUnitPrice(item.getUnitPrice());
            ir.setSubtotal(item.getSubtotal());
            inventoryRepository.findByBookId(item.getBook().getId())
                    .ifPresent(inv -> ir.setAvailableStock(inv.getAvailableQuantity()));
            return ir;
        }).collect(Collectors.toList());

        resp.setItems(items);
        resp.setTotalItems(items.stream().mapToInt(CartItemResponse::getQuantity).sum());
        resp.setTotalAmount(items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        return resp;
    }
}
