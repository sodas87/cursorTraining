package com.shopcursor.service;

import com.shopcursor.exception.ResourceNotFoundException;
import com.shopcursor.model.Cart;
import com.shopcursor.model.CartItem;
import com.shopcursor.model.Product;
import com.shopcursor.repository.CartRepository;
import com.shopcursor.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing shopping cart operations.
 * Handles adding, updating, removing items and calculating totals.
 */
@Service
@Transactional
public class CartService {

    // Constants
    private static final int MAX_QUANTITY_PER_ITEM = 99;
    private static final int MIN_QUANTITY_PER_ITEM = 1;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * Retrieves a cart by its ID.
     *
     * @param cartId the cart identifier
     * @return the cart
     * @throws ResourceNotFoundException if cart is not found
     */
    public Cart getCartById(Long cartId) {
        if (cartId == null) {
            throw new IllegalArgumentException("Cart ID cannot be null");
        }

        return cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cart not found with id: " + cartId));
    }

    /**
     * Adds a product to the cart or updates quantity if already present.
     *
     * @param cartId    the cart identifier
     * @param productId the product identifier
     * @param quantity  the quantity to add
     * @return the updated cart
     * @throws ResourceNotFoundException if cart or product not found
     * @throws IllegalArgumentException  if quantity is invalid
     * @throws IllegalStateException     if adding would exceed max quantity
     */
    public Cart addToCart(Long cartId, Long productId, int quantity) {
        validateInput(cartId, productId, quantity);

        Cart cart = getCartById(cartId);
        Product product = getProductById(productId);

        CartItem existingItem = findCartItemByProductId(cart, productId);

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + quantity;
            validateQuantity(newQuantity);
            existingItem.setQuantity(newQuantity);
        } else {
            validateQuantity(quantity);
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setCart(cart);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    /**
     * Updates the quantity of a product in the cart.
     *
     * @param cartId    the cart identifier
     * @param productId the product identifier
     * @param quantity  the new quantity
     * @return the updated cart
     * @throws ResourceNotFoundException if cart or product not found
     * @throws IllegalArgumentException  if quantity is invalid
     */
    public Cart updateQuantity(Long cartId, Long productId, int quantity) {
        validateInput(cartId, productId, quantity);
        validateQuantity(quantity);

        Cart cart = getCartById(cartId);
        CartItem item = findCartItemByProductId(cart, productId);

        if (item == null) {
            throw new ResourceNotFoundException(
                    "Product with id " + productId + " not found in cart " + cartId);
        }

        item.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    /**
     * Removes a product from the cart.
     *
     * @param cartId    the cart identifier
     * @param productId the product identifier
     * @return the updated cart
     * @throws ResourceNotFoundException if cart not found
     */
    public Cart removeFromCart(Long cartId, Long productId) {
        if (cartId == null) {
            throw new IllegalArgumentException("Cart ID cannot be null");
        }
        if (productId == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }

        Cart cart = getCartById(cartId);
        CartItem itemToRemove = findCartItemByProductId(cart, productId);

        if (itemToRemove != null) {
            cart.getItems().remove(itemToRemove);
            return cartRepository.save(cart);
        }

        // Item not in cart - return cart unchanged
        return cart;
    }

    /**
     * Calculates the total price for all items in the cart.
     *
     * @param cartId the cart identifier
     * @return the total price
     * @throws ResourceNotFoundException if cart not found
     */
    public double calculateTotal(Long cartId) {
        Cart cart = getCartById(cartId);

        return cart.getItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }

    /**
     * Removes all items from the cart.
     *
     * @param cartId the cart identifier
     * @return the emptied cart
     * @throws ResourceNotFoundException if cart not found
     */
    public Cart clearCart(Long cartId) {
        Cart cart = getCartById(cartId);
        cart.getItems().clear();
        return cartRepository.save(cart);
    }

    // Private helper methods

    /**
     * Finds a cart item by product ID.
     *
     * @param cart      the cart to search
     * @param productId the product identifier
     * @return the cart item or null if not found
     */
    private CartItem findCartItemByProductId(Cart cart, Long productId) {
        return cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);
    }

    /**
     * Retrieves a product by ID.
     *
     * @param productId the product identifier
     * @return the product
     * @throws ResourceNotFoundException if product not found
     */
    private Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + productId));
    }

    /**
     * Validates that quantity is within acceptable range.
     *
     * @param quantity the quantity to validate
     * @throws IllegalArgumentException if quantity is invalid
     */
    private void validateQuantity(int quantity) {
        if (quantity < MIN_QUANTITY_PER_ITEM) {
            throw new IllegalArgumentException(
                    String.format("Quantity must be at least %d", MIN_QUANTITY_PER_ITEM));
        }
        if (quantity > MAX_QUANTITY_PER_ITEM) {
            throw new IllegalStateException(
                    String.format("Quantity cannot exceed %d items per product", MAX_QUANTITY_PER_ITEM));
        }
    }

    /**
     * Validates input parameters for cart operations.
     *
     * @param cartId    the cart identifier
     * @param productId the product identifier
     * @param quantity  the quantity
     * @throws IllegalArgumentException if any parameter is invalid
     */
    private void validateInput(Long cartId, Long productId, Integer quantity) {
        if (cartId == null) {
            throw new IllegalArgumentException("Cart ID cannot be null");
        }
        if (productId == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
        if (quantity == null) {
            throw new IllegalArgumentException("Quantity cannot be null");
        }
    }
}
