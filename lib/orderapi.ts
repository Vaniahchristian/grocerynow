const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
import type { CartItem } from "./cart-context";

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  location: string;
  zone: string;
  notes?: string;
  items: Array<{
    productId: string | number;
    quantity: number;
    price: number;
  }>;
}

export interface OrderResponse {
  id: number;
  customerName: string;
  phone: string;
  location: string;
  deliveryZone?: string;
  notes: string;
  status: string;
  subtotal?: number;
  deliveryFee?: number;
  total: number;
  createdAt: string;
  items: Array<{
    productId: string | number;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export async function createOrder(input: CreateOrderInput): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Order creation failed");
  }
  return res.json();
}

export async function listOrders(): Promise<OrderResponse[]> {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }
  return res.json();
}

export async function updateOrderStatusApi(orderId: string | number, status: 'pending' | 'confirmed' | 'delivered'): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error('Failed to update order status');
  }
  return res.json();
}

export async function deleteOrderApi(orderId: string | number): Promise<any> {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('Failed to delete order');
  }
  return res.json();
}

export async function deleteAllOrdersApi(): Promise<any> {
  const res = await fetch(`${API_BASE}/orders`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('Failed to delete all orders');
  }
  return res.json();
}
