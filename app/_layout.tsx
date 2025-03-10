import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './(auth)/AuthContext';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

function NavigationGuard() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(tabs)';
    
    if (!isAuthenticated && inProtectedGroup) {
      // Redirect to login when accessing protected routes while not authenticated
      router.replace('/');
    } else if (isAuthenticated && (inAuthGroup || segments[0] === undefined)) {
      // Redirect to home when authenticated and trying to access auth routes or index
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, loading, segments]);

  return null;
}

function RootLayoutNav() {
  return (
    <>
      <NavigationGuard />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
            animation: 'none'
          }} 
        />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
