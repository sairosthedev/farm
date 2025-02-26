import { Platform } from 'react-native';

// Get the development IP address
export const DEV_IP = '192.168.100.33'; // Your computer's actual IP address

// Helper to determine if we're running in Expo Go
const isExpoGo = __DEV__ && !window.location;

// Configure API URL based on platform and environment
export const API_URL = (() => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }

  if (Platform.OS === 'android') {
    // Android emulator considers localhost as 10.0.2.2
    return __DEV__ 
      ? isExpoGo
        ? `http://${DEV_IP}:5000/api`  // Expo Go on physical device
        : 'http://10.0.2.2:5000/api'   // Android Emulator
      : 'http://10.0.2.2:5000/api';    // Production
  }

  if (Platform.OS === 'ios') {
    return __DEV__
      ? isExpoGo
        ? `http://${DEV_IP}:5000/api`  // Expo Go on physical device
        : 'http://localhost:5000/api'   // iOS Simulator
      : 'http://localhost:5000/api';    // Production
  }

  return 'http://localhost:5000/api';   // Default fallback
})();

// Debug information
console.log('Environment Info:', {
  platform: Platform.OS,
  isDev: __DEV__,
  isExpoGo,
  apiUrl: API_URL,
  devIp: DEV_IP
});

export default {
  API_URL,
  DEV_IP,
}; 