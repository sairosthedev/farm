import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: string;
  location: string;
  image: string;
  seller: {
    name: string;
    verified: boolean;
  };
};

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Maize',
    price: 150,
    quantity: '50kg',
    location: 'Harare',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=600',
    seller: {
      name: 'John Moyo',
      verified: true,
    },
  },
  {
    id: '2',
    name: 'Organic Tomatoes',
    price: 80,
    quantity: '20kg',
    location: 'Bulawayo',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600',
    seller: {
      name: 'Sarah Ndlovu',
      verified: true,
    },
  },
];

export default function MarketplaceScreen() {
  const [category, setCategory] = useState('all');

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable style={styles.productCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>
        <Text style={styles.productQuantity}>{item.quantity}</Text>
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName}>{item.seller.name}</Text>
          {item.seller.verified && (
            <Ionicons name="checkmark-circle" size={16} color="#2D6A4F" />
          )}
        </View>
        <Text style={styles.location}>
          <Ionicons name="location" size={14} color="#666" /> {item.location}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <Pressable style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#2D6A4F" />
        </Pressable>
      </View>

      <View style={styles.categories}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Crops', 'Livestock', 'Seeds', 'Equipment'].map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryButton,
                category === cat.toLowerCase() && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory(cat.toLowerCase())}>
              <Text
                style={[
                  styles.categoryText,
                  category === cat.toLowerCase() && styles.categoryTextActive,
                ]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlashList
        data={SAMPLE_PRODUCTS}
        renderItem={renderProduct}
        estimatedItemSize={200}
        contentContainerStyle={styles.productList}
      />

      <Pressable style={styles.addButton}>
        <Ionicons name="add" size={24} color="#FFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  filterButton: {
    padding: 8,
  },
  categories: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  categoryButtonActive: {
    backgroundColor: '#2D6A4F',
  },
  categoryText: {
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  productList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productInfo: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  productQuantity: {
    color: '#666',
    marginBottom: 8,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerName: {
    marginRight: 4,
    color: '#666',
  },
  location: {
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 