import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from './config';

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
    try {
      const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
        headers: await this.getHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Network response was not ok');
      }
      
      return response.json();
    } catch (error) {
      console.error(`GET request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async post(endpoint: string, data: any) {
    try {
      console.log(`Making POST request to ${API_URL}${endpoint}`);
      const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Network response was not ok');
      }
      
      return response.json();
    } catch (error) {
      console.error(`POST request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async put(endpoint: string, data: any) {
    try {
      const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Network response was not ok');
      }
      
      return response.json();
    } catch (error) {
      console.error(`PUT request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async delete(endpoint: string) {
    try {
      const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: await this.getHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Network response was not ok');
      }
      
      return response.json();
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  }
}

export const api = ApiClient.getInstance();

// Auth-related API functions
export const authApi = {
  async testConnection() {
    try {
      console.log('Testing connection to:', `${API_URL}/auth/login`);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type'
        },
      });
      console.log('Connection test response status:', response.status);
      console.log('Connection test response headers:', {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
        'access-control-allow-headers': response.headers.get('access-control-allow-headers')
      });
      return response.ok || response.status === 204;
    } catch (error) {
      console.error('Connection test failed with error:', error);
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        console.log('This appears to be a network connectivity issue. Checking if server is reachable...');
        try {
          // Try a direct fetch to the base URL
          await fetch(API_URL.replace('/api', ''));
          console.log('Base server is reachable, but API endpoint is not responding correctly');
        } catch (e) {
          console.log('Base server is not reachable. This might be an incorrect IP or server not running');
        }
      }
      return false;
    }
  },

  async login(email: string, password: string) {
    try {
      // Test connection before attempting login
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.log('Current API URL configuration:', {
          API_URL,
          platform: Platform.OS,
          isDev: __DEV__
        });
        throw new Error(
          'Cannot connect to the server. Please ensure:\n' +
          '1. The backend server is running\n' +
          '2. You are using the correct IP address\n' +
          '3. Your device is on the same network as the server'
        );
      }

      console.log('Attempting login with email:', email);
      return await api.post('/auth/login', { email, password });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
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

// Default export
export default {
  api,
  authApi,
  storage
}; 