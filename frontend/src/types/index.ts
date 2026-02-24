export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stockQuantity: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  sessionId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
}
