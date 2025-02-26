import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from './config';
import axios, { AxiosInstance } from 'axios';

const TIMEOUT_DURATION = 15000; // 15 seconds timeout

// Helper function to handle fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
};

// Storage helper functions
export const storage = {
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return await SecureStore.deleteItemAsync(key);
  }
};

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: TIMEOUT_DURATION,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await storage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await storage.removeItem('authToken');
          await storage.removeItem('userData');
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string | null) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    location: string;
  }) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Logistics endpoints
  async createLogisticsRequest(requestData: {
    type: 'pickup' | 'delivery' | 'storage';
    pickupLocation: {
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    deliveryLocation?: {
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    scheduledDate: Date;
    items: Array<{
      product: string;
      quantity: number;
      unit: string;
    }>;
    vehicleType: 'small' | 'medium' | 'large' | 'refrigerated';
    specialInstructions?: string;
    price: number;
  }) {
    const response = await this.api.post('/logistics', requestData);
    return response.data;
  }

  async getLogisticsRequests(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }) {
    const response = await this.api.get('/logistics', { params });
    return response.data;
  }

  async getLogisticsRequest(id: string) {
    const response = await this.api.get(`/logistics/${id}`);
    return response.data;
  }

  async updateLogisticsRequest(
    id: string,
    updateData: Partial<{
      status: string;
      specialInstructions: string;
      scheduledDate: Date;
    }>
  ) {
    const response = await this.api.put(`/logistics/${id}`, updateData);
    return response.data;
  }

  async deleteLogisticsRequest(id: string) {
    const response = await this.api.delete(`/logistics/${id}`);
    return response.data;
  }

  // Products endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    lat?: number;
    lng?: number;
    maxDistance?: number;
  }) {
    const response = await this.api.get('/products', { params });
    return response.data;
  }

  async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    unit: string;
    category: string;
    images: string[];
    location: {
      coordinates: number[];
      address: string;
    };
  }) {
    const response = await this.api.post('/products', productData);
    return response.data;
  }

  async getProduct(id: string) {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async updateProduct(
    id: string,
    updateData: Partial<{
      name: string;
      description: string;
      price: number;
      quantity: number;
      isAvailable: boolean;
    }>
  ) {
    const response = await this.api.put(`/products/${id}`, updateData);
    return response.data;
  }

  async deleteProduct(id: string) {
    const response = await this.api.delete(`/products/${id}`);
    return response.data;
  }

  // Orders endpoints
  async createOrder(orderData: {
    items: Array<{
      product: string;
      quantity: number;
    }>;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      coordinates: number[];
    };
    paymentMethod: 'cash' | 'card' | 'bank_transfer';
    notes?: string;
  }) {
    const response = await this.api.post('/orders', orderData);
    return response.data;
  }

  async getBuyerOrders() {
    const response = await this.api.get('/orders/buyer');
    return response.data;
  }

  async getFarmerOrders() {
    const response = await this.api.get('/orders/farmer');
    return response.data;
  }

  async getOrder(id: string) {
    const response = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  async updateOrderStatus(
    id: string,
    status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  ) {
    const response = await this.api.put(`/orders/${id}/status`, { status });
    return response.data;
  }

  async cancelOrder(id: string) {
    const response = await this.api.post(`/orders/${id}/cancel`);
    return response.data;
  }
}

export const api = new ApiClient();
export default ApiClient; 