package com.shopcursor.controller;

import com.shopcursor.model.Cart;
import com.shopcursor.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<Cart> getCart(@PathVariable String sessionId) {
        return ResponseEntity.ok(cartService.getOrCreateCart(sessionId));
    }

    @PostMapping("/{sessionId}/items")
    public ResponseEntity<Cart> addToCart(
            @PathVariable String sessionId,
            @RequestBody Map<String, Object> body) {
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = body.containsKey("quantity") ? Integer.parseInt(body.get("quantity").toString()) : 1;
        return ResponseEntity.ok(cartService.addToCart(sessionId, productId, quantity));
    }

    @PutMapping("/{sessionId}/items/{productId}")
    public ResponseEntity<Cart> updateCartItem(
            @PathVariable String sessionId,
            @PathVariable Long productId,
            @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(cartService.updateCartItem(sessionId, productId, body.get("quantity")));
    }

    @DeleteMapping("/{sessionId}/items/{productId}")
    public ResponseEntity<Cart> removeFromCart(
            @PathVariable String sessionId,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeFromCart(sessionId, productId));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> clearCart(@PathVariable String sessionId) {
        cartService.clearCart(sessionId);
        return ResponseEntity.noContent().build();
    }
}
