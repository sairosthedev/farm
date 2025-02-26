import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, storage } from '../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  avatar?: string;
  expertise?: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    location: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await storage.getItem('authToken');
      const storedUser = await storage.getItem('userData');
      
      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        api.setToken(storedToken);
        setTokenState(storedToken);
        setIsAuthenticated(true);
        setUser(userData);

        // Verify token and get fresh user data
        try {
          const { user: freshUserData } = await api.getCurrentUser();
          setUser(freshUserData);
        } catch (error) {
          console.error('Error refreshing user data:', error);
          // If token is invalid, log out
          await logout();
        }
      }
    } catch (error) {
      console.error('Error loading auth info:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { token, user: userData } = await api.login(email, password);
      await storage.setItem('authToken', token);
      await storage.setItem('userData', JSON.stringify(userData));
      api.setToken(token);
      setTokenState(token);
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    location: string;
  }) => {
    try {
      const { token, user: newUser } = await api.register(userData);
      await storage.setItem('authToken', token);
      await storage.setItem('userData', JSON.stringify(newUser));
      api.setToken(token);
      setTokenState(token);
      setIsAuthenticated(true);
      setUser(newUser);
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storage.removeItem('authToken');
      await storage.removeItem('userData');
      api.setToken(null);
      setTokenState(null);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser = { ...user, ...userData };
      await storage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
        loading,
        updateUser,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
export default AuthProvider; 