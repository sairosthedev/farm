import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '../(auth)/AuthContext';
import { router } from 'expo-router';

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
    { id: '1', name: 'Top Seller', icon: 'trophy' },
    { id: '2', name: 'Verified Farmer', icon: 'shield-checkmark' },
    { id: '3', name: 'Early Adopter', icon: 'trending-up' },
  ],
};

const MENU_ITEMS = [
  { id: '1', title: 'My Products', icon: 'cube' },
  { id: '2', title: 'Orders', icon: 'cart' },
  { id: '3', title: 'Transaction History', icon: 'cash' },
  { id: '4', title: 'Saved Items', icon: 'heart' },
  { id: '5', title: 'Settings', icon: 'settings' },
  { id: '6', title: 'Help & Support', icon: 'help-circle' },
];

export default function ProfileScreen() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user?.image || PROFILE_DATA.user.image }}
            style={styles.profileImage}
            contentFit="cover"
          />
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
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{PROFILE_DATA.stats.products}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{PROFILE_DATA.stats.sales}</Text>
            <Text style={styles.statLabel}>Sales</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{PROFILE_DATA.stats.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.badges}>
          {PROFILE_DATA.badges.map((badge) => (
            <View key={badge.id} style={styles.badge}>
              <Ionicons name={badge.icon as any} size={20} color="#2D6A4F" />
              <Text style={styles.badgeText}>{badge.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <Pressable key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon as any} size={24} color="#2D6A4F" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#FF4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
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