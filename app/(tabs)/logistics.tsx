import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { bookTransport, getActiveDeliveries, cancelDelivery, Transport, getAvailableTransports } from '../utils/logistics';

export default function LogisticsScreen() {
  const [activeBooking, setActiveBooking] = useState<Transport | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTransports, setAvailableTransports] = useState<Transport[]>([]);
  const [isLoadingTransports, setIsLoadingTransports] = useState(true);

  useEffect(() => {
    loadActiveDelivery();
    loadAvailableTransports();
  }, []);

  const loadAvailableTransports = async () => {
    try {
      setIsLoadingTransports(true);
      const transports = await getAvailableTransports();
      setAvailableTransports(transports);
    } catch (error) {
      console.error('Error loading available transports:', error);
    } finally {
      setIsLoadingTransports(false);
    }
  };

  const loadActiveDelivery = async () => {
    try {
      const activeDeliveries = await getActiveDeliveries();
      if (activeDeliveries && activeDeliveries.length > 0) {
        // Convert backend data to Transport type
        const delivery = activeDeliveries[0];
        setActiveBooking({
          id: delivery._id,
          type: delivery.vehicleType === 'refrigerated' ? '3-Ton Refrigerated Truck' : 
                delivery.vehicleType === 'large' ? '3-Ton Truck' :
                delivery.vehicleType === 'medium' ? 'Pick-up Truck' : 'Small Van',
          capacity: delivery.vehicleType === 'large' ? '3000kg' : 
                   delivery.vehicleType === 'medium' ? '1000kg' : '500kg',
          location: delivery.pickupLocation.address,
          price: delivery.price,
          specialFeatures: delivery.specialInstructions ? delivery.specialInstructions.split(', ') : [],
          driver: {
            name: delivery.assignedDriver?.name || 'Unassigned',
            rating: 4.8,
            image: delivery.assignedDriver?.avatar || 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=300',
            completedAgriDeliveries: 0
          }
        });
      }
    } catch (error) {
      console.error('Error loading active delivery:', error);
    }
  };

  const handleBooking = (transport: Transport) => {
    setSelectedTransport(transport);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (selectedTransport) {
      setIsLoading(true);
      try {
        await bookTransport(
          selectedTransport,
          'Harare Central Market', // You would get this from user input or location service
          'Bulawayo Distribution Center' // You would get this from user input or location service
        );
        setActiveBooking(selectedTransport);
        setShowBookingModal(false);
        Alert.alert(
          'Booking Confirmed',
          `Your transport with ${selectedTransport.driver.name} has been booked successfully!`
        );
        loadActiveDelivery(); // Reload the active delivery to get the latest data
      } catch (error) {
        console.error('Error confirming booking:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelBooking = async () => {
    if (activeBooking) {
      Alert.alert(
        'Cancel Booking',
        'Are you sure you want to cancel this booking?',
        [
          { text: 'No', style: 'cancel' },
          { 
            text: 'Yes', 
            style: 'destructive',
            onPress: async () => {
              setIsLoading(true);
              try {
                await cancelDelivery(activeBooking.id);
                setActiveBooking(null);
              } catch (error) {
                console.error('Error cancelling booking:', error);
              } finally {
                setIsLoading(false);
              }
            }
          }
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2D6A4F', '#40916C']}
        style={styles.header}
      >
        <Text style={styles.title}>Transport & Delivery</Text>
        <Text style={styles.subtitle}>Find reliable transport for your produce</Text>
      </LinearGradient>

      {activeBooking ? (
        <View style={styles.activeDelivery}>
          <View style={styles.deliveryHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="time" size={24} color="#2D6A4F" />
            </View>
            <Text style={styles.deliveryTitle}>Active Delivery</Text>
          </View>
          <View style={styles.deliveryContent}>
            <View style={styles.activeBookingInfo}>
              <Image
                source={{ uri: activeBooking.driver.image }}
                style={styles.activeDriverImage}
                contentFit="cover"
              />
              <View style={styles.activeBookingDetails}>
                <Text style={styles.activeDriverName}>{activeBooking.driver.name}</Text>
                <Text style={styles.activeTransportType}>{activeBooking.type}</Text>
              </View>
            </View>
            <View style={styles.deliveryProgress}>
              <View style={styles.progressLine} />
              <View style={styles.progressSteps}>
                <View style={[styles.progressStep, styles.progressStepCompleted]}>
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                  <Text style={styles.stepText}>Pickup</Text>
                </View>
                <View style={[styles.progressStep, styles.progressStepActive]}>
                  <View style={styles.pulsingDot} />
                  <Text style={styles.stepText}>In Transit</Text>
                </View>
                <View style={styles.progressStep}>
                  <Text style={styles.stepText}>Delivered</Text>
                </View>
              </View>
            </View>
            <View style={styles.deliveryDetails}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.deliveryInfo}>Estimated arrival in 2 hours</Text>
            </View>
            <Pressable 
              style={styles.cancelButton}
              onPress={handleCancelBooking}
            >
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Transport</Text>
        <Text style={styles.sectionSubtitle}>Select the best option for your produce</Text>
        
        {isLoadingTransports ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2D6A4F" />
            <Text style={styles.loadingText}>Loading available transports...</Text>
          </View>
        ) : availableTransports.length === 0 ? (
          <View style={styles.noTransportsContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#666" />
            <Text style={styles.noTransportsText}>No transports available at the moment</Text>
            <Pressable 
              style={styles.refreshButton}
              onPress={loadAvailableTransports}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </Pressable>
          </View>
        ) : (
          availableTransports.map((transport) => (
            <Pressable 
              key={transport.id} 
              style={styles.transportCard}
              onPress={() => handleBooking(transport)}
            >
              <LinearGradient
                colors={['rgba(45, 106, 79, 0.05)', 'rgba(45, 106, 79, 0.02)']}
                style={styles.cardGradient}
              >
                <View style={styles.transportInfo}>
                  <View style={styles.driverInfo}>
                    <Image
                      source={{ uri: transport.driver.image }}
                      style={styles.driverImage}
                      contentFit="cover"
                    />
                    <View>
                      <Text style={styles.driverName}>{transport.driver.name}</Text>
                      <View style={styles.rating}>
                        <Ionicons name="star" size={16} color="#FFB800" />
                        <Text style={styles.ratingText}>{transport.driver.rating}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.transportDetails}>
                    <Text style={styles.transportType}>{transport.type}</Text>
                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <Ionicons name="cube" size={14} color="#666" />
                        <Text style={styles.detailText}>{transport.capacity}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="location" size={14} color="#666" />
                        <Text style={styles.detailText}>
                          {transport.location}
                          {transport.estimatedDistance && ` (${transport.estimatedDistance})`}
                        </Text>
                      </View>
                    </View>
                    {transport.temperatureControl && (
                      <View style={styles.temperatureControlContainer}>
                        <Ionicons name="thermometer" size={14} color="#2D6A4F" />
                        <Text style={styles.temperatureControl}>
                          Temperature Range: {transport.temperatureControl.range}
                        </Text>
                      </View>
                    )}
                    <View style={styles.features}>
                      {transport.specialFeatures.map((feature, index) => (
                        <View key={index} style={styles.featureTag}>
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.deliveryStats}>
                      <Ionicons name="checkmark-circle" size={14} color="#2D6A4F" />
                      <Text style={styles.completedDeliveries}>
                        {transport.driver.completedAgriDeliveries} successful deliveries
                      </Text>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>${transport.price}</Text>
                    <Text style={styles.priceUnit}>/trip</Text>
                  </View>
                </View>
                <Pressable 
                  style={styles.bookButton}
                  onPress={() => handleBooking(transport)}
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
                </Pressable>
              </LinearGradient>
            </Pressable>
          ))
        )}
      </View>

      <Modal
        visible={showBookingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            {selectedTransport && (
              <>
                <View style={styles.modalTransportInfo}>
                  <Image
                    source={{ uri: selectedTransport.driver.image }}
                    style={styles.modalDriverImage}
                    contentFit="cover"
                  />
                  <View>
                    <Text style={styles.modalDriverName}>{selectedTransport.driver.name}</Text>
                    <Text style={styles.modalTransportType}>{selectedTransport.type}</Text>
                    <Text style={styles.modalPrice}>${selectedTransport.price}/trip</Text>
                  </View>
                </View>
                <View style={styles.modalButtons}>
                  <Pressable 
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setShowBookingModal(false)}
                  >
                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                  </Pressable>
                  <Pressable 
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={confirmBooking}
                  >
                    <Text style={styles.modalButtonTextConfirm}>Confirm Booking</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  iconContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 8,
  },
  activeDelivery: {
    margin: 16,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  deliveryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  deliveryContent: {
    alignItems: 'center',
  },
  deliveryProgress: {
    width: '100%',
    marginBottom: 20,
  },
  progressLine: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    height: 3,
    backgroundColor: '#E0E0E0',
    borderRadius: 1.5,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepActive: {
    borderColor: '#2D6A4F',
    backgroundColor: '#FFF',
  },
  progressStepCompleted: {
    borderColor: '#2D6A4F',
    backgroundColor: '#2D6A4F',
  },
  pulsingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2D6A4F',
  },
  stepText: {
    position: 'absolute',
    top: 36,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  deliveryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  deliveryInfo: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  transportCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  transportInfo: {
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    color: '#666',
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    color: '#666',
    fontSize: 14,
  },
  transportType: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2D6A4F',
  },
  temperatureControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  featureTag: {
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  featureText: {
    color: '#2D6A4F',
    fontSize: 13,
    fontWeight: '500',
  },
  deliveryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  completedDeliveries: {
    color: '#2D6A4F',
    fontSize: 13,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  priceUnit: {
    marginLeft: 4,
    color: '#666',
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: '#2D6A4F',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 4,
  },
  transportDetails: {
    marginBottom: 16,
  },
  temperatureControl: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalTransportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalDriverImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  modalDriverName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalTransportType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F5F5F5',
  },
  modalButtonConfirm: {
    backgroundColor: '#2D6A4F',
  },
  modalButtonTextCancel: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextConfirm: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  activeBookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  activeDriverImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  activeBookingDetails: {
    flex: 1,
  },
  activeDriverName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  activeTransportType: {
    fontSize: 14,
    color: '#666',
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  noTransportsContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noTransportsText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 16,
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});