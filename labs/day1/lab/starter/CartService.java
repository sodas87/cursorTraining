package com.shopcursor.service;

import com.shopcursor.model.Cart;
import com.shopcursor.model.CartItem;
import com.shopcursor.model.Product;
import com.shopcursor.repository.CartRepository;
import com.shopcursor.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public Cart getCartById(Long id) {
        Optional<Cart> c = cartRepository.findById(id);
        if (c.isPresent()) {
            return c.get();
        }
        return null;
    }

    public Cart addToCart(Long cartId, Long productId, int qty) {
        Cart cart = getCartById(cartId);
        if (cart == null) {
            return null;
        }

        Optional<Product> p = productRepository.findById(productId);
        if (!p.isPresent()) {
            return null;
        }
        Product product = p.get();

        // Check if product already in cart
        CartItem existing = null;
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                existing = item;
                break;
            }
        }

        if (existing != null) {
            int newQty = existing.getQuantity() + qty;
            if (newQty > 99) {
                return null;
            }
            existing.setQuantity(newQty);
        } else {
            if (qty > 99 || qty < 0) {
                return null;
            }
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setQuantity(qty);
            newItem.setCart(cart);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    public Cart updateQuantity(Long cartId, Long productId, int qty) {
        Cart cart = getCartById(cartId);
        if (cart == null) {
            return null;
        }

        if (qty > 99 || qty < 0) {
            return null;
        }

        // Find the item
        CartItem item = null;
        for (CartItem ci : cart.getItems()) {
            if (ci.getProduct().getId().equals(productId)) {
                item = ci;
                break;
            }
        }

        if (item == null) {
            return null;
        }

        item.setQuantity(qty);
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(Long cartId, Long productId) {
        Cart cart = getCartById(cartId);
        if (cart == null) {
            return null;
        }

        // Find and remove item
        CartItem toRemove = null;
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                toRemove = item;
                break;
            }
        }

        if (toRemove != null) {
            cart.getItems().remove(toRemove);
        }

        return cartRepository.save(cart);
    }

    public double calculateTotal(Long cartId) {
        Cart cart = getCartById(cartId);
        if (cart == null) {
            return 0.0;
        }

        double total = 0;
        for (CartItem item : cart.getItems()) {
            total += item.getProduct().getPrice() * item.getQuantity();
        }

        return total;
    }

    public Cart clearCart(Long cartId) {
        Cart cart = getCartById(cartId);
        if (cart == null) {
            return null;
        }

        cart.getItems().clear();
        return cartRepository.save(cart);
    }
}
