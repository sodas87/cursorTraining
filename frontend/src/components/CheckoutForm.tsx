import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { checkoutApi } from '../api/client';
import { CheckoutFormData } from '../types';
import './CheckoutForm.css';

// WORKSHOP: Code smell - Form validation could be extracted to a custom hook
export default function CheckoutForm() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      const order = await checkoutApi.checkout(formData);
      await refreshCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>No items to checkout</h2>
        <p>Add some items to your cart first!</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-form-section">
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit} data-testid="checkout-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Developer"
              data-testid="input-name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              data-testid="input-email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Shipping Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Code Street, Dev City"
              rows={3}
              data-testid="input-address"
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <button
            type="submit"
            className="place-order-btn"
            disabled={submitting}
            data-testid="place-order-btn"
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>

      <div className="order-summary-section">
        <h3>Order Summary</h3>
        {cart.items.map((item) => (
          <div key={item.id} className="summary-item">
            <span>
              {item.product.name} x{item.quantity}
            </span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-total">
          <span>Total:</span>
          <span>${cart.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
