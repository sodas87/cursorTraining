package com.shopcursor.service;

import com.shopcursor.exception.ResourceNotFoundException;
import com.shopcursor.model.*;
import com.shopcursor.repository.CartRepository;
import com.shopcursor.repository.OrderRepository;
import com.shopcursor.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class CheckoutService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public CheckoutService(CartRepository cartRepository, OrderRepository orderRepository,
                           ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order checkout(String sessionId, Map<String, String> customerInfo) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Order order = new Order();
        order.setCustomerName(customerInfo.get("name"));
        order.setCustomerEmail(customerInfo.get("email"));
        order.setShippingAddress(customerInfo.get("address"));
        order.setTotal(cart.getTotal());

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem(
                    order,
                    cartItem.getProduct().getName(),
                    cartItem.getProduct().getPrice(),
                    cartItem.getQuantity()
            );
            order.getItems().add(orderItem);

            // Reduce stock
            Product product = cartItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        Order savedOrder = orderRepository.save(order);

        // Clear the cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public Order getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        order.getItems().size();
        return order;
    }
}
