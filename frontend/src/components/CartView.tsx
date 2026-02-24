import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartView.css';

export default function CartView() {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-cart" data-testid="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any developer swag yet!</p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-view" data-testid="cart-view">
      <h2>Shopping Cart ({cart.itemCount} items)</h2>
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item" data-testid={`cart-item-${item.product.id}`}>
            <div className="cart-item-info">
              <h3>{item.product.name}</h3>
              <p className="cart-item-price">${item.product.price.toFixed(2)} each</p>
            </div>
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  data-testid={`decrease-${item.product.id}`}
                >
                  -
                </button>
                <span data-testid={`quantity-${item.product.id}`}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  data-testid={`increase-${item.product.id}`}
                >
                  +
                </button>
              </div>
              <span className="cart-item-subtotal">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.product.id)}
                data-testid={`remove-${item.product.id}`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span data-testid="cart-total">${cart.total.toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="checkout-btn" data-testid="checkout-btn">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
