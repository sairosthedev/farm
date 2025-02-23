import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../(auth)/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user?.name || 'Farmer'}!</Text>
      <Text style={styles.description}>
        Choose a tab below to explore our services
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2D6A4F',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
}); 