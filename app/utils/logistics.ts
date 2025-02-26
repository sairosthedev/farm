import { api } from './api';
import { Alert } from 'react-native';

export type Transport = {
  id: string;
  type: string;
  capacity: string;
  location: string;
  price: number;
  specialFeatures: string[];
  estimatedDistance?: string;
  temperatureControl?: {
    available: boolean;
    range: string;
  };
  driver: {
    name: string;
    rating: number;
    image: string;
    completedAgriDeliveries: number;
  };
};

export const getAvailableTransports = async (location?: { lat: number; lng: number }) => {
  try {
    const response = await api.getLogisticsRequests({
      status: 'available',
    });
    
    // For development/testing, return sample data if API doesn't return vehicles
    if (!response || !Array.isArray(response.requests)) {
      // Return sample data for testing
      return [
        {
          id: '1',
          type: '3-Ton Refrigerated Truck',
          capacity: '3000kg',
          location: 'Harare',
          price: 250,
          specialFeatures: ['Temperature Controlled', 'GPS Tracking', 'Weatherproof'],
          estimatedDistance: '45km',
          temperatureControl: {
            available: true,
            range: '2°C to 8°C'
          },
          driver: {
            name: 'David Moyo',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=300',
            completedAgriDeliveries: 156
          },
        },
        {
          id: '2',
          type: 'Pick-up Truck',
          capacity: '1000kg',
          location: 'Bulawayo',
          price: 150,
          specialFeatures: ['Tarpaulin Cover', 'Quick Loading'],
          estimatedDistance: '30km',
          driver: {
            name: 'Grace Ndlovu',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=300',
            completedAgriDeliveries: 89
          },
        },
      ];
    }
    
    // Convert API response to Transport type
    return response.requests.map((request: any) => ({
      id: request._id,
      type: request.vehicleType === 'refrigerated' ? '3-Ton Refrigerated Truck' :
            request.vehicleType === 'large' ? '3-Ton Truck' :
            request.vehicleType === 'medium' ? 'Pick-up Truck' : 'Small Van',
      capacity: request.vehicleType === 'large' ? '3000kg' :
                request.vehicleType === 'medium' ? '1000kg' : '500kg',
      location: request.pickupLocation?.address || 'Unknown',
      price: request.price || 0,
      specialFeatures: request.specialInstructions ? request.specialInstructions.split(', ') : [],
      estimatedDistance: request.estimatedDistance ? `${request.estimatedDistance}km` : undefined,
      temperatureControl: request.vehicleType === 'refrigerated' ? {
        available: true,
        range: '2°C to 8°C'
      } : undefined,
      driver: {
        name: request.assignedDriver?.name || 'Unassigned',
        rating: request.assignedDriver?.rating || 4.5,
        image: request.assignedDriver?.avatar || 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=300',
        completedAgriDeliveries: request.assignedDriver?.completedDeliveries || 0
      }
    }));
  } catch (error) {
    console.error('Error fetching available transports:', error);
    Alert.alert(
      'Error',
      'There was an error fetching available transports. Please try again.'
    );
    throw error;
  }
};

export const bookTransport = async (transport: Transport, pickupLocation: string, deliveryLocation: string) => {
  try {
    // Convert the transport data to match the backend schema
    const requestData = {
      type: 'delivery' as const,
      pickupLocation: {
        address: pickupLocation,
        coordinates: {
          lat: 0, // You would need to get these from a geocoding service
          lng: 0,
        },
      },
      deliveryLocation: {
        address: deliveryLocation,
        coordinates: {
          lat: 0, // You would need to get these from a geocoding service
          lng: 0,
        },
      },
      scheduledDate: new Date(),
      items: [], // You would need to specify the items being transported
      vehicleType: transport.type.includes('Refrigerated') ? 'refrigerated' as const : 
                  transport.capacity.includes('3000') ? 'large' as const :
                  transport.capacity.includes('1000') ? 'medium' as const : 'small' as const,
      specialInstructions: transport.specialFeatures.join(', '),
      price: transport.price,
    };

    const response = await api.createLogisticsRequest(requestData);
    return response;
  } catch (error) {
    console.error('Error booking transport:', error);
    Alert.alert(
      'Booking Error',
      'There was an error booking your transport. Please try again.'
    );
    throw error;
  }
};

export const getActiveDeliveries = async () => {
  try {
    const response = await api.getLogisticsRequests({
      status: 'in_progress',
    });
    return response.requests;
  } catch (error) {
    console.error('Error fetching active deliveries:', error);
    Alert.alert(
      'Error',
      'There was an error fetching your active deliveries. Please try again.'
    );
    throw error;
  }
};

export const cancelDelivery = async (id: string) => {
  try {
    const response = await api.updateLogisticsRequest(id, {
      status: 'cancelled',
    });
    return response;
  } catch (error) {
    console.error('Error cancelling delivery:', error);
    Alert.alert(
      'Error',
      'There was an error cancelling your delivery. Please try again.'
    );
    throw error;
  }
};

const logisticsService = {
  bookTransport,
  getActiveDeliveries,
  cancelDelivery,
  getAvailableTransports,
};

export default logisticsService; 