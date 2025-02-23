import { Tabs } from 'expo-router';
import { Pressable, Platform } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2D6A4F',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#666',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFF',
          borderTopWidth: 0,
          ...(Platform.OS === 'web' 
            ? {
                boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
              }
            : {
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }
          ),
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFF',
        },
        headerTintColor: colorScheme === 'dark' ? '#FFF' : '#000',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-basket" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="logistics"
        options={{
          title: 'Logistics',
          tabBarIcon: ({ color }) => <FontAwesome name="truck" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="advisory"
        options={{
          title: 'Advisory',
          tabBarIcon: ({ color }) => <FontAwesome name="info-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}