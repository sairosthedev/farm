import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { api, storage, authApi } from '../utils/api';

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
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await storage.getItem('authToken');
      const storedUser = await storage.getItem('userData');
      
      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        api.setToken(token);
        setIsAuthenticated(true);
        setUser(userData);

        // Verify token and get fresh user data
        try {
          const { user: freshUserData } = await authApi.getCurrentUser();
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

  const login = async (token: string, userData: User) => {
    try {
      await storage.setItem('authToken', token);
      await storage.setItem('userData', JSON.stringify(userData));
      api.setToken(token);
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Error storing auth info:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        storage.removeItem('authToken'),
        storage.removeItem('userData')
      ]);
      api.setToken(null);
      setIsAuthenticated(false);
      setUser(null);
      // Return a promise that resolves after state updates are definitely complete
      return new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error removing auth info:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const { user: updatedUser } = await authApi.updateProfile(userData);
      setUser(updatedUser);
      await storage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, updateUser }}>
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