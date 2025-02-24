import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from './AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authApi } from '../utils/api';

// API URL configuration
const DEV_IP = '192.168.100.16'; // Replace with your computer's local IP address
const API_URL = Platform.select({
  web: 'http://localhost:5000/api',
  // For Expo Go on physical device, use local IP
  android: __DEV__ ? `http://${DEV_IP}:5000/api` : 'http://10.0.2.2:5000/api',
  ios: __DEV__ ? `http://${DEV_IP}:5000/api` : 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});

console.log('Platform:', Platform.OS);
console.log('Using API URL:', API_URL);

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleRegister = async () => {
    const { name, email, phone, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword || !name || !phone) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { token, user } = await authApi.register({
        name,
        email,
        password,
        phone
      });

      // First set the authentication state
      await login(token, user);
      
      // Small delay to ensure auth state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Then navigate
      router.replace('/(tabs)/home');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2940' }}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.overlay}>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Ionicons name="leaf" size={40} color="#2D6A4F" />
              </View>
              
              <Text style={styles.title}>Join Our Community</Text>
              <Text style={styles.subtitle}>Create your farmer account</Text>
              
              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={formData.name}
                  onChangeText={(value) => handleChange('name', value)}
                  autoCapitalize="words"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(value) => handleChange('email', value)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChangeText={(value) => handleChange('phone', value)}
                  keyboardType="phone-pad"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleChange('confirmPassword', value)}
                  secureTextEntry
                  placeholderTextColor="#666"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/login')}
                style={styles.linkButton}
                disabled={isLoading}
              >
                <Text style={styles.linkText}>Already have an account? Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2D6A4F',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2D6A4F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#DC3545',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#FFE9E9',
    padding: 12,
    borderRadius: 8,
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#2D6A4F',
    fontSize: 16,
  },
}); 