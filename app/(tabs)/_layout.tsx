import { Tabs } from 'expo-router';
import { Pressable, Platform, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const TabBarIcon = ({ name, color, focused }: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string; focused: boolean }) => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: withSpring(focused ? 1.2 : 1, { damping: 12 }) },
          { translateY: withTiming(focused ? -4 : 0, { duration: 200 }) }
        ],
        opacity: withTiming(focused ? 1 : 0.8, { duration: 200 }),
      };
    });

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 50 }}>
        <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
          <FontAwesome name={name} size={22} color={color} />
        </Animated.View>
        {focused && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: 20,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: '#2D6A4F',
            }}
          />
        )}
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={({ route, navigation }) => ({
        tabBarActiveTintColor: '#2D6A4F',
        tabBarInactiveTintColor: isDark ? '#888' : '#666',
        tabBarStyle: route.name === 'index'
          ? { display: 'none' }
          : {
              backgroundColor: isDark ? '#1A1A1A' : '#FFF',
              borderTopWidth: 0,
              height: 65,
              paddingBottom: 10,
              paddingTop: 5,
              ...(Platform.OS === 'web'
                ? {
                    boxShadow: '0px -2px 20px rgba(0, 0, 0, 0.08)',
                  }
                : {
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.12,
                    shadowRadius: 12,
                  }
              ),
            },
        headerStyle: {
          backgroundColor: isDark ? '#1A1A1A' : '#FFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#333' : '#F0F0F0',
        },
        headerTintColor: isDark ? '#FFF' : '#000',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 4,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
        },
        tabBarButton: (route.name === 'index' || route.name === 'add-product' || route.name === 'settings') ? () => null : undefined,
      })}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="add-product"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={({ navigation }) => ({
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        })}
      />
      <Tabs.Screen
        name="marketplace"
        options={({ navigation }) => ({
          title: 'Market',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="shopping-basket" color={color} focused={focused} />
          ),
        })}
      />
      <Tabs.Screen
        name="logistics"
        options={({ navigation }) => ({
          title: 'Logistics',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="truck" color={color} focused={focused} />
          ),
        })}
      />
      <Tabs.Screen
        name="advisory"
        options={({ navigation }) => ({
          title: 'Advisory',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="info-circle" color={color} focused={focused} />
          ),
        })}
      />
      <Tabs.Screen
        name="community"
        options={({ navigation }) => ({
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View style={useAnimatedStyle(() => ({
                transform: [{ scale: withSpring(focused ? 1.2 : 1) }],
              }))}>
                <Ionicons name="people" size={24} color={color} />
              </Animated.View>
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -8,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: '#2D6A4F',
                  }}
                />
              )}
            </View>
          ),
        })}
      />
      <Tabs.Screen
        name="profile"
        options={({ navigation }) => ({
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View style={useAnimatedStyle(() => ({
                transform: [{ scale: withSpring(focused ? 1.2 : 1) }],
              }))}>
                <Ionicons name="person" size={24} color={color} />
              </Animated.View>
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -8,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: '#2D6A4F',
                  }}
                />
              )}
            </View>
          ),
        })}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          headerShown: true,
        }}
      />
    </Tabs>
  );
}