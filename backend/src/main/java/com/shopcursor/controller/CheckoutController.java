package com.shopcursor.controller;

import com.shopcursor.model.Order;
import com.shopcursor.service.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/{sessionId}")
    public ResponseEntity<Order> checkout(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> customerInfo) {
        return ResponseEntity.ok(checkoutService.checkout(sessionId, customerInfo));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<Order> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(checkoutService.getOrder(orderId));
    }
}
