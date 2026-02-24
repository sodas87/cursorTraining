import axios from 'axios';
import { Product, Cart, Order, CheckoutFormData } from '../types';

const api = axios.create({
  baseURL: '/api',
});

const SESSION_KEY = 'shopcursor_session';

function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export const productApi = {
  getAll: () => api.get<Product[]>('/products').then((res) => res.data),
  getById: (id: number) => api.get<Product>(`/products/${id}`).then((res) => res.data),
  search: (query: string) => api.get<Product[]>(`/products?search=${query}`).then((res) => res.data),
  getByCategory: (category: string) =>
    api.get<Product[]>(`/products?category=${category}`).then((res) => res.data),
};

export const cartApi = {
  get: () => api.get<Cart>(`/cart/${getSessionId()}`).then((res) => res.data),
  addItem: (productId: number, quantity: number = 1) =>
    api.post<Cart>(`/cart/${getSessionId()}/items`, { productId, quantity }).then((res) => res.data),
  updateItem: (productId: number, quantity: number) =>
    api.put<Cart>(`/cart/${getSessionId()}/items/${productId}`, { quantity }).then((res) => res.data),
  removeItem: (productId: number) =>
    api.delete<Cart>(`/cart/${getSessionId()}/items/${productId}`).then((res) => res.data),
  clear: () => api.delete(`/cart/${getSessionId()}`),
};

export const checkoutApi = {
  checkout: (data: CheckoutFormData) =>
    api.post<Order>(`/checkout/${getSessionId()}`, data).then((res) => res.data),
  getOrder: (orderId: number) =>
    api.get<Order>(`/checkout/orders/${orderId}`).then((res) => res.data),
};
