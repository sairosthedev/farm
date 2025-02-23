import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../(auth)/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user } = useAuth();

  const stats = [
    {
      value: '2.4K',
      label: 'Active Farmers',
      icon: 'person' as const,
    },
    {
      value: '150+',
      label: 'Daily Trades',
      icon: 'swap-horizontal' as const,
    },
    {
      value: '45T',
      label: 'Crops Traded',
      icon: 'nutrition' as const,
    },
    {
      value: '98%',
      label: 'Success Rate',
      icon: 'checkmark-circle' as const,
    },
  ];

  const features = [
    {
      title: 'Marketplace',
      icon: 'basket' as const,
      description: 'Buy & sell crops, livestock with verified traders',
      route: '/(tabs)/marketplace' as const,
    },
    {
      title: 'Advisory Services',
      icon: 'information-circle' as const,
      description: 'Get AI-powered farming tips and weather updates',
      route: '/(tabs)/advisory' as const,
    },
    {
      title: 'Logistics',
      icon: 'bus' as const,
      description: 'Book transport and track deliveries',
      route: '/(tabs)/logistics' as const,
    },
    {
      title: 'Community',
      icon: 'people' as const,
      description: 'Join discussions and access training resources',
      route: '/(tabs)/community' as const,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.name || 'Farmer'}!</Text>
        <Text style={styles.description}>
          Your one-stop platform for agricultural success in Zimbabwe
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Today's Overview</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Ionicons name={stat.icon} size={24} color="#2D6A4F" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureCard}
            onPress={() => router.push(feature.route)}
          >
            <Ionicons name={feature.icon} size={32} color="#2D6A4F" />
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  featuresGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
}); 