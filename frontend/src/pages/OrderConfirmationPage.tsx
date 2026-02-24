import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../types';
import { checkoutApi } from '../api/client';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    checkoutApi
      .getOrder(parseInt(orderId))
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="error">Order not found</div>;
  }

  return (
    <div className="order-confirmation" data-testid="order-confirmation">
      <div className="confirmation-header">
        <span className="check-icon">&#10003;</span>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order, {order.customerName}!</p>
      </div>

      <div className="order-details">
        <h2>Order #{order.id}</h2>
        <p className="order-status">Status: {order.status}</p>

        <div className="order-items-list">
          {order.items.map((item) => (
            <div key={item.id} className="order-item-row">
              <span>
                {item.productName} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="order-total-row">
          <span>Total:</span>
          <span data-testid="order-total">${order.total.toFixed(2)}</span>
        </div>

        <div className="shipping-info">
          <h3>Shipping to:</h3>
          <p>{order.customerName}</p>
          <p>{order.shippingAddress}</p>
          <p>{order.customerEmail}</p>
        </div>
      </div>

      <Link to="/" className="back-to-shop-btn">
        Back to Shop
      </Link>
    </div>
  );
}
