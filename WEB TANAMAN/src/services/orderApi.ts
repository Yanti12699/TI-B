import axios from 'axios';
import { Order } from '../types/store';


/**
 * ============================================================================
 * AXIOS API CLIENT FOR ORDERS SERVICE (MySQL integrated)
 * ============================================================================
 */

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('flora_session_id');
  if (sessionId) {
    config.headers['x-session-id'] = sessionId;
  }
  return config;
});

// Create new order (checkout) -> POST /api/orders
export async function createOrderApi(orderData: Partial<Order>): Promise<{ success: boolean; order: Order; message: string }> {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
}

// Admin: Get all orders -> GET /api/orders
export async function getAllOrdersApi(): Promise<{ success: boolean; data: Order[] }> {
  const response = await apiClient.get('/orders');
  return response.data;
}

// User: Get orders for specific user -> GET /api/orders/user/:id
export async function getUserOrdersApi(userId: number): Promise<{ success: boolean; data: Order[] }> {
  const response = await apiClient.get(`/orders/user/${userId}`);
  return response.data;
}

// Admin: Verify payment -> PUT /api/orders/:id/verify-payment
export async function verifyPaymentApi(orderId: number): Promise<{ success: boolean; message: string; order: Order }> {
  const response = await apiClient.put(`/orders/${orderId}/verify-payment`);
  return response.data;
}

// Admin: Update shipping status & tracking number -> PUT /api/orders/:id/shipping
export async function updateShippingApi(
  orderId: number,
  orderStatus: Order['order_status'],
  trackingNumber?: string | null
): Promise<{ success: boolean; message: string; order: Order }> {
  const response = await apiClient.put(`/orders/${orderId}/shipping`, {
    order_status: orderStatus,
    tracking_number: trackingNumber || null
  });
  return response.data;
}

// Admin Only: Delete order -> DELETE /api/orders/:id
export async function deleteOrderApi(orderId: number): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete(`/orders/${orderId}`);
  return response.data;
}

// User/Admin: Update payment proof -> PUT /api/orders/:id/proof
export async function updateOrderProofApi(orderId: number, proof: string | null): Promise<{ success: boolean; message: string; order: Order }> {
  const response = await apiClient.put(`/orders/${orderId}/proof`, { payment_proof: proof });
  return response.data;
}

// Payment Methods API
export async function getPaymentMethodsApi(): Promise<{ success: boolean; data: any[] }> {
  const response = await apiClient.get('/payment-methods');
  return response.data;
}

export async function createPaymentMethodApi(data: any): Promise<{ success: boolean; data: any; message: string }> {
  const response = await apiClient.post('/payment-methods', data);
  return response.data;
}

export async function updatePaymentMethodApi(id: number, data: any): Promise<{ success: boolean; data: any; message: string }> {
  const response = await apiClient.put(`/payment-methods/${id}`, data);
  return response.data;
}

export async function deletePaymentMethodApi(id: number): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete(`/payment-methods/${id}`);
  return response.data;
}

