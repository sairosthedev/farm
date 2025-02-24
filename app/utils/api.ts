import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// API URL configuration
const DEV_IP = '192.168.100.74'; // Replace with your computer's local IP address
export const API_URL = Platform.select({
  web: 'http://localhost:5000/api',
  // For Expo Go on physical device, use local IP
  android: __DEV__ ? `http://${DEV_IP}:5000/api` : 'http://10.0.2.2:5000/api',
  ios: __DEV__ ? `http://${DEV_IP}:5000/api` : 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});

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

// API client with authentication
class ApiClient {
  private static instance: ApiClient;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  async getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async get(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Network response was not ok');
    }
    
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Network response was not ok');
    }
    
    return response.json();
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Network response was not ok');
    }
    
    return response.json();
  }

  async delete(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Network response was not ok');
    }
    
    return response.json();
  }
}

export const api = ApiClient.getInstance();

// Auth-related API functions
export const authApi = {
  async login(email: string, password: string) {
    return api.post('/auth/login', { email, password });
  },

  async register(data: { name: string; email: string; password: string; phone: string }) {
    return api.post('/auth/register', data);
  },

  async getCurrentUser() {
    return api.get('/auth/me');
  },

  async updateProfile(data: any) {
    return api.put('/auth/profile', data);
  }
};

// Posts-related API functions
export const postsApi = {
  async getPosts(params?: { page?: number; limit?: number; category?: string; tag?: string }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return api.get(`/posts${queryParams ? `?${queryParams}` : ''}`);
  },

  async createPost(data: any) {
    return api.post('/posts', data);
  },

  async getPost(id: string) {
    return api.get(`/posts/${id}`);
  },

  async updatePost(id: string, data: any) {
    return api.put(`/posts/${id}`, data);
  },

  async deletePost(id: string) {
    return api.delete(`/posts/${id}`);
  },

  async likePost(id: string) {
    return api.post(`/posts/${id}/like`, {});
  },

  async addComment(id: string, content: string) {
    return api.post(`/posts/${id}/comments`, { content });
  }
};

// Advisory-related API functions
export const advisoryApi = {
  async getAdvisories(params?: { page?: number; limit?: number; category?: string; season?: string; crop?: string }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return api.get(`/advisory${queryParams ? `?${queryParams}` : ''}`);
  },

  async createAdvisory(data: any) {
    return api.post('/advisory', data);
  },

  async getAdvisory(id: string) {
    return api.get(`/advisory/${id}`);
  },

  async updateAdvisory(id: string, data: any) {
    return api.put(`/advisory/${id}`, data);
  },

  async deleteAdvisory(id: string) {
    return api.delete(`/advisory/${id}`);
  },

  async likeAdvisory(id: string) {
    return api.post(`/advisory/${id}/like`, {});
  }
};

// Logistics-related API functions
export const logisticsApi = {
  async getRequests(params?: { page?: number; limit?: number; type?: string; status?: string }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return api.get(`/logistics${queryParams ? `?${queryParams}` : ''}`);
  },

  async createRequest(data: any) {
    return api.post('/logistics', data);
  },

  async getRequest(id: string) {
    return api.get(`/logistics/${id}`);
  },

  async updateRequest(id: string, data: any) {
    return api.put(`/logistics/${id}`, data);
  },

  async deleteRequest(id: string) {
    return api.delete(`/logistics/${id}`);
  },

  async updateRequestStatus(id: string, data: { status: string; assignedDriver?: string }) {
    return api.post(`/logistics/${id}/status`, data);
  }
}; 