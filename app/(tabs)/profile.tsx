import { View, Text, StyleSheet, ScrollView, Platform, Alert, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '../(auth)/AuthContext';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const PROFILE_DATA = {
  user: {
    name: 'Tendai Moyo',
    location: 'Harare, Zimbabwe',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
    bio: 'Passionate farmer with 10+ years experience in sustainable agriculture',
    verified: true,
  },
  stats: {
    products: 15,
    sales: 124,
    rating: 4.8,
  },
  badges: [
    { id: '1', name: 'Top Seller', icon: 'trophy', description: 'Achieved outstanding sales performance' },
    { id: '2', name: 'Verified Farmer', icon: 'shield-checkmark', description: 'Identity and credentials verified' },
    { id: '3', name: 'Early Adopter', icon: 'trending-up', description: 'One of our first platform users' },
  ],
};

const MENU_ITEMS = [
  { id: '1', title: 'My Products', icon: 'cube', route: '/(tabs)/marketplace', params: { filter: 'my-products' } },
  { id: '2', title: 'Orders', icon: 'cart', route: '/orders' },
  { id: '3', title: 'Transaction History', icon: 'cash', route: '/transactions' },
  { id: '4', title: 'Saved Items', icon: 'heart', route: '/saved' },
  { id: '5', title: 'Settings', icon: 'settings', route: '/(tabs)/settings' },
  { id: '6', title: 'Help & Support', icon: 'help-circle', route: '/support' },
];

export default function ProfileScreen() {
  const { logout, user } = useAuth();

  const handleMenuItemPress = (item: typeof MENU_ITEMS[0]) => {
    if (item.route === '/(tabs)/marketplace' || item.route === '/(tabs)/settings') {
      router.push({ pathname: item.route, params: item.params });
    } else {
      Alert.alert('Coming Soon', `The ${item.title} feature will be available soon!`);
    }
  };

  const handleBadgePress = (badge: typeof PROFILE_DATA.badges[0]) => {
    Alert.alert(badge.name, badge.description);
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing will be available in the next update!');
  };

  const handleStatPress = (statType: string) => {
    switch (statType) {
      case 'products':
        router.push('/(tabs)/marketplace?filter=my-products');
        break;
      case 'sales':
        Alert.alert('Coming Soon', 'Transaction history will be available soon!');
        break;
      case 'rating':
        Alert.alert('Ratings', 'Based on customer reviews and successful transactions');
        break;
    }
  };

  const performLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        performLogout();
      }
    } else {
      Alert.alert(
        'Confirm Logout',
        'Are you sure?',
        [
          { text: 'Cancel' },
          { 
            text: 'Yes',
            onPress: performLogout
          }
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Pressable onPress={handleEditProfile}>
            <Image
              source={{ uri: user?.image || PROFILE_DATA.user.image }}
              style={styles.profileImage}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.editOverlay}>
              <Ionicons name="pencil" size={16} color="#FFF" />
            </View>
          </Pressable>
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{user?.name || PROFILE_DATA.user.name}</Text>
              {PROFILE_DATA.user.verified && (
                <Ionicons name="checkmark-circle" size={20} color="#2D6A4F" />
              )}
            </View>
            <Text style={styles.location}>
              <Ionicons name="location" size={14} color="#666" /> {PROFILE_DATA.user.location}
            </Text>
            <Text style={styles.bio}>{PROFILE_DATA.user.bio}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => handleStatPress('products')}
          >
            <Text style={styles.statNumber}>{PROFILE_DATA.stats.products}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => handleStatPress('sales')}
          >
            <Text style={styles.statNumber}>{PROFILE_DATA.stats.sales}</Text>
            <Text style={styles.statLabel}>Sales</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => handleStatPress('rating')}
          >
            <Text style={styles.statNumber}>{PROFILE_DATA.stats.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.badges}>
          {PROFILE_DATA.badges.map((badge) => (
            <TouchableOpacity
              key={badge.id}
              style={styles.badge}
              onPress={() => handleBadgePress(badge)}
              activeOpacity={0.7}
            >
              <Ionicons name={badge.icon as any} size={20} color="#2D6A4F" />
              <Text style={styles.badgeText}>{badge.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon as any} size={24} color="#2D6A4F" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Animated.View style={useAnimatedStyle(() => ({
              transform: [{ translateX: withSpring(0) }],
            }))}>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out" size={24} color="#FF4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  editOverlay: {
    position: 'absolute',
    right: 16,
    bottom: 0,
    backgroundColor: '#2D6A4F',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginRight: 8,
  },
  location: {
    color: '#666',
    marginBottom: 8,
  },
  bio: {
    color: '#444',
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    padding: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D6A4F',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  badgeText: {
    marginLeft: 6,
    color: '#2D6A4F',
    fontWeight: '500',
  },
  menu: {
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 32,
  },
  logoutText: {
    marginLeft: 8,
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
        }
    ),
  },
});