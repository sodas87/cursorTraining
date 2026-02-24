package com.shopcursor.service;

import com.shopcursor.exception.ResourceNotFoundException;
import com.shopcursor.model.Cart;
import com.shopcursor.model.CartItem;
import com.shopcursor.model.Product;
import com.shopcursor.repository.CartRepository;
import com.shopcursor.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// WORKSHOP: Code smell - This service has multiple issues for refactoring exercises:
// 1. God method (addToCart does too much)
// 2. Magic numbers
// 3. Poor error messages
// 4. Duplicate logic
// 5. No input validation extracted

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public Cart getOrCreateCart(String sessionId) {
        return cartRepository.findBySessionId(sessionId)
                .orElseGet(() -> cartRepository.save(new Cart(sessionId)));
    }

    // WORKSHOP: Code smell - God method, magic numbers, poor error handling
    @Transactional
    public Cart addToCart(String sessionId, Long productId, int quantity) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseGet(() -> cartRepository.save(new Cart(sessionId)));

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            throw new RuntimeException("not found");
        }

        // Magic number: max 99 items
        if (quantity > 99) {
            throw new RuntimeException("too many");
        }
        if (quantity < 1) {
            throw new RuntimeException("bad quantity");
        }

        // Check stock
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("no stock");
        }

        // Check if product already in cart
        CartItem existingItem = null;
        for (int i = 0; i < cart.getItems().size(); i++) {
            if (cart.getItems().get(i).getProduct().getId().equals(productId)) {
                existingItem = cart.getItems().get(i);
                break;
            }
        }

        if (existingItem != null) {
            int newQty = existingItem.getQuantity() + quantity;
            // Magic number again
            if (newQty > 99) {
                throw new RuntimeException("too many");
            }
            if (product.getStockQuantity() < newQty) {
                throw new RuntimeException("no stock");
            }
            existingItem.setQuantity(newQty);
        } else {
            CartItem newItem = new CartItem(cart, product, quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    // WORKSHOP: Code smell - Duplicate logic from addToCart
    @Transactional
    public Cart updateCartItem(String sessionId, Long productId, int quantity) {
        Cart cart = cartRepository.findBySessionId(sessionId).orElse(null);
        if (cart == null) {
            throw new RuntimeException("no cart");
        }

        if (quantity < 0) {
            throw new RuntimeException("bad quantity");
        }

        CartItem item = null;
        for (int i = 0; i < cart.getItems().size(); i++) {
            if (cart.getItems().get(i).getProduct().getId().equals(productId)) {
                item = cart.getItems().get(i);
                break;
            }
        }

        if (item == null) {
            throw new RuntimeException("item not found");
        }

        if (quantity == 0) {
            cart.getItems().remove(item);
        } else {
            // Magic number
            if (quantity > 99) {
                throw new RuntimeException("too many");
            }
            Product product = productRepository.findById(productId).orElse(null);
            if (product != null && product.getStockQuantity() < quantity) {
                throw new RuntimeException("no stock");
            }
            item.setQuantity(quantity);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(String sessionId, Long productId) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(String sessionId) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
