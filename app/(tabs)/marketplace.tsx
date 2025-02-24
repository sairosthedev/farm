import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore, Product } from '../store/ProductStore';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';

export default function MarketplaceScreen() {
  const { 
    products, 
    filteredProducts, 
    selectedCategory, 
    setCategory, 
    applyFilters,
    priceRange,
    setPriceRange,
    selectedLocation,
    setLocation,
    sellerType,
    setSellerType
  } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);

  // Get unique locations from products
  const locations = [...new Set(products.map(p => p.location))];

  useEffect(() => {
    applyFilters();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => (
    <Pressable 
      style={styles.productCard}
      onPress={() => setSelectedProduct(item)}
    >
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

  const ProductDetailsModal = () => {
    if (!selectedProduct) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedProduct}
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          <View style={styles.modalContent}>
            <Pressable 
              style={styles.closeButton}
              onPress={() => setSelectedProduct(null)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
            
            <Image
              source={{ uri: selectedProduct.image }}
              style={styles.modalImage}
              contentFit="cover"
            />
            
            <View style={styles.modalInfo}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                <Text style={styles.modalPrice}>${selectedProduct.price}</Text>
              </View>
              
              <Text style={styles.modalQuantity}>Quantity: {selectedProduct.quantity}</Text>
              
              <View style={styles.modalSellerInfo}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300' }}
                  style={styles.sellerImage}
                  contentFit="cover"
                />
                <View style={styles.sellerDetails}>
                  <Text style={styles.modalSellerName}>{selectedProduct.seller.name}</Text>
                  {selectedProduct.seller.verified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#2D6A4F" />
                      <Text style={styles.verifiedText}>Verified Seller</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.modalLocation}>
                <Ionicons name="location" size={18} color="#666" />
                <Text style={styles.modalLocationText}>{selectedProduct.location}</Text>
              </View>

              <Pressable style={styles.contactButton}>
                <Ionicons name="chatbubble-outline" size={20} color="#FFF" />
                <Text style={styles.contactButtonText}>Contact Seller</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const FiltersModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showFilters}
      onRequestClose={() => setShowFilters(false)}
    >
      <BlurView intensity={20} style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.filtersContent]}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <Pressable onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </View>

          <ScrollView style={styles.filtersScroll}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <Text style={styles.priceRangeText}>
                  ${tempPriceRange.min.toFixed(0)} - ${tempPriceRange.max.toFixed(0)}
                </Text>
                <Slider
                  style={styles.priceSlider}
                  minimumValue={0}
                  maximumValue={20000}
                  value={tempPriceRange.max}
                  onValueChange={(value) => 
                    setTempPriceRange(prev => ({ ...prev, max: value }))
                  }
                  minimumTrackTintColor="#2D6A4F"
                  maximumTrackTintColor="#D1D1D1"
                />
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Location</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.locationContainer}
              >
                <Pressable
                  style={[
                    styles.locationChip,
                    selectedLocation === '' && styles.locationChipActive,
                  ]}
                  onPress={() => setLocation('')}
                >
                  <Text style={[
                    styles.locationChipText,
                    selectedLocation === '' && styles.locationChipTextActive,
                  ]}>
                    All
                  </Text>
                </Pressable>
                {locations.map((location) => (
                  <Pressable
                    key={location}
                    style={[
                      styles.locationChip,
                      selectedLocation === location && styles.locationChipActive,
                    ]}
                    onPress={() => setLocation(location)}
                  >
                    <Text style={[
                      styles.locationChipText,
                      selectedLocation === location && styles.locationChipTextActive,
                    ]}>
                      {location}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Seller Type</Text>
              <View style={styles.sellerTypeContainer}>
                {(['all', 'verified', 'unverified'] as const).map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.sellerTypeButton,
                      sellerType === type && styles.sellerTypeButtonActive,
                    ]}
                    onPress={() => setSellerType(type)}
                  >
                    <Text style={[
                      styles.sellerTypeText,
                      sellerType === type && styles.sellerTypeTextActive,
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                    {type === 'verified' && (
                      <Ionicons 
                        name="checkmark-circle" 
                        size={16} 
                        color={sellerType === type ? '#FFF' : '#2D6A4F'} 
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          <Pressable 
            style={styles.applyFiltersButton} 
            onPress={() => {
              setPriceRange(tempPriceRange);
              setShowFilters(false);
            }}
          >
            <Text style={styles.applyFiltersText}>Apply Filters</Text>
          </Pressable>
        </View>
      </BlurView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <Pressable 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
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
                selectedCategory === cat.toLowerCase() && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory(cat.toLowerCase())}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.toLowerCase() && styles.categoryTextActive,
                ]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlashList
        data={filteredProducts.length > 0 ? filteredProducts : products}
        renderItem={renderProduct}
        estimatedItemSize={200}
        contentContainerStyle={styles.productList}
      />

      <Pressable 
        style={styles.addButton}
        onPress={() => router.push('/add-product')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </Pressable>

      <ProductDetailsModal />
      <FiltersModal />
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '80%',
    marginTop: 'auto',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 8,
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  modalInfo: {
    marginTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  modalQuantity: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  modalSellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F7F7F7',
    padding: 12,
    borderRadius: 12,
  },
  sellerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  modalSellerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#2D6A4F',
    marginLeft: 4,
    fontSize: 14,
  },
  modalLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalLocationText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  contactButton: {
    backgroundColor: '#2D6A4F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  filtersContent: {
    minHeight: '60%',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  filtersTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  applyFiltersButton: {
    backgroundColor: '#2D6A4F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyFiltersText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  filtersScroll: {
    flex: 1,
  },
  priceRangeContainer: {
    paddingHorizontal: 8,
  },
  priceRangeText: {
    fontSize: 16,
    color: '#2D6A4F',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  priceSlider: {
    width: '100%',
    height: 40,
  },
  locationContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  locationChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  locationChipActive: {
    backgroundColor: '#2D6A4F',
  },
  locationChipText: {
    color: '#666',
  },
  locationChipTextActive: {
    color: '#FFF',
  },
  sellerTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  sellerTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    gap: 4,
  },
  sellerTypeButtonActive: {
    backgroundColor: '#2D6A4F',
  },
  sellerTypeText: {
    color: '#666',
  },
  sellerTypeTextActive: {
    color: '#FFF',
  },
}); 