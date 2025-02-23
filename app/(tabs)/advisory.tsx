import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function AdvisoryScreen() {
  const [weather, setWeather] = useState({
    temp: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    rainChance: 30,
    windSpeed: 12,
    uvIndex: 7,
    soilMoisture: 45,
  });

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedTab, setSelectedTab] = useState('weather');
  const [alerts, setAlerts] = useState([
    {
      type: 'weather',
      title: 'Heavy Rain Expected',
      description: 'Prepare your fields for heavy rainfall expected in the next 48 hours. Consider delaying any planned spraying activities.',
      severity: 'warning'
    },
    {
      type: 'pest',
      title: 'Fall Armyworm Alert',
      description: 'Fall armyworm activity detected in your region. Inspect your maize crops and consider preventive measures.',
      severity: 'high'
    }
  ]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const renderWeatherSection = () => (
    <>
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <View>
            <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
            <Text style={styles.weatherCondition}>{weather.condition}</Text>
          </View>
          <Ionicons name="partly-sunny" size={48} color="#2D6A4F" />
        </View>
        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetail}>
            <Ionicons name="water" size={20} color="#2D6A4F" />
            <Text style={styles.weatherDetailText}>Humidity: {weather.humidity}%</Text>
          </View>
          <View style={styles.weatherDetail}>
            <Ionicons name="rainy" size={20} color="#2D6A4F" />
            <Text style={styles.weatherDetailText}>Rain: {weather.rainChance}%</Text>
          </View>
        </View>
        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetail}>
            <Ionicons name="speedometer" size={20} color="#2D6A4F" />
            <Text style={styles.weatherDetailText}>Wind: {weather.windSpeed} km/h</Text>
          </View>
          <View style={styles.weatherDetail}>
            <Ionicons name="sunny" size={20} color="#2D6A4F" />
            <Text style={styles.weatherDetailText}>UV Index: {weather.uvIndex}</Text>
          </View>
        </View>
        <View style={styles.soilMoistureContainer}>
          <Text style={styles.soilMoistureTitle}>Soil Moisture</Text>
          <View style={styles.soilMoistureBar}>
            <View style={[styles.soilMoistureFill, { width: `${weather.soilMoisture}%` }]} />
          </View>
          <Text style={styles.soilMoistureText}>{weather.soilMoisture}% - Optimal Range</Text>
        </View>
        <View style={styles.forecastContainer}>
          <Text style={styles.forecastTitle}>5-Day Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3, 4, 5].map((day) => (
              <View key={day} style={styles.forecastDay}>
                <Text style={styles.forecastDate}>Mar {day + 14}</Text>
                <Ionicons name="sunny" size={24} color="#2D6A4F" />
                <Text style={styles.forecastTemp}>29°C</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alerts & Recommendations</Text>
        {alerts.map((alert, index) => (
          <View 
            key={index} 
            style={[
              styles.alertCard,
              { borderLeftColor: alert.severity === 'high' ? '#FF4444' : '#FFB800' }
            ]}
          >
            <Ionicons 
              name={alert.type === 'weather' ? 'warning' : 'bug'} 
              size={24} 
              color={alert.severity === 'high' ? '#FF4444' : '#FFB800'} 
            />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertText}>{alert.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );

  const renderCropSection = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Crop Health Analysis</Text>
        <View style={styles.actionButtons}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="camera" size={24} color="#2D6A4F" />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Ionicons name="images" size={24} color="#2D6A4F" />
            <Text style={styles.actionButtonText}>Upload Image</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Analysis</Text>
          <Pressable>
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2].map((item) => (
            <View key={item} style={styles.analysisCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1599493006232-b7e6c446b923?q=80&w=600' }}
                style={styles.analysisImage}
                contentFit="cover"
              />
              <View style={styles.analysisContent}>
                <Text style={styles.analysisTitle}>Maize Leaf Analysis</Text>
                <Text style={styles.analysisDate}>March {14 + item}, 2024</Text>
                <View style={styles.healthIndicator}>
                  <View style={[styles.healthBar, { width: '85%' }]} />
                  <Text style={styles.healthText}>Health: 85%</Text>
                </View>
                <Text style={styles.analysisDetails}>
                  Minor signs of nitrogen deficiency detected. Consider applying
                  supplementary nitrogen fertilizer.
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Treatment History</Text>
        <View style={styles.treatmentCard}>
          <View style={styles.treatmentHeader}>
            <Text style={styles.treatmentDate}>March 12, 2024</Text>
            <Text style={styles.treatmentType}>Fertilizer Application</Text>
          </View>
          <Text style={styles.treatmentDetails}>
            Applied NPK fertilizer (15-15-15) at 250kg/ha
          </Text>
        </View>
      </View>
    </>
  );

  const renderMarketSection = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Market Insights</Text>
        <View style={styles.marketCard}>
          <Text style={styles.marketTitle}>Crop Price Trends</Text>
          <View style={styles.priceItem}>
            <View style={styles.priceHeader}>
              <Text style={styles.cropName}>Maize</Text>
              <Text style={styles.priceChange}>+5.2%</Text>
            </View>
            <Text style={styles.priceValue}>$280/ton</Text>
            <View style={styles.priceChart}>
              <View style={styles.chartBar} />
              <View style={[styles.chartBar, { height: 20 }]} />
              <View style={[styles.chartBar, { height: 25 }]} />
              <View style={[styles.chartBar, { height: 15 }]} />
              <View style={[styles.chartBar, { height: 30 }]} />
            </View>
          </View>
          <View style={styles.priceItem}>
            <View style={styles.priceHeader}>
              <Text style={styles.cropName}>Soybeans</Text>
              <Text style={[styles.priceChange, styles.priceDown]}>-2.1%</Text>
            </View>
            <Text style={styles.priceValue}>$450/ton</Text>
            <View style={styles.priceChart}>
              <View style={[styles.chartBar, { height: 25 }]} />
              <View style={[styles.chartBar, { height: 30 }]} />
              <View style={[styles.chartBar, { height: 20 }]} />
              <View style={[styles.chartBar, { height: 15 }]} />
              <View style={[styles.chartBar, { height: 10 }]} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Market Recommendations</Text>
        <View style={styles.recommendationCard}>
          <Ionicons name="trending-up" size={24} color="#2D6A4F" />
          <View style={styles.recommendationContent}>
            <Text style={styles.recommendationTitle}>
              Optimal Selling Time for Maize
            </Text>
            <Text style={styles.recommendationText}>
              Current market trends suggest holding maize stock for 2-3 weeks for
              better prices due to expected supply shortages.
            </Text>
            <View style={styles.recommendationStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Current Price</Text>
                <Text style={styles.statValue}>$280/ton</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Projected Price</Text>
                <Text style={styles.statValue}>$310/ton</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Farm Advisory</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, selectedTab === 'weather' && styles.tabActive]}
          onPress={() => setSelectedTab('weather')}>
          <Ionicons
            name="partly-sunny"
            size={20}
            color={selectedTab === 'weather' ? '#2D6A4F' : '#666'}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === 'weather' && styles.tabTextActive,
            ]}>
            Weather
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === 'crop' && styles.tabActive]}
          onPress={() => setSelectedTab('crop')}>
          <Ionicons
            name="leaf"
            size={20}
            color={selectedTab === 'crop' ? '#2D6A4F' : '#666'}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === 'crop' && styles.tabTextActive,
            ]}>
            Crop Health
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === 'market' && styles.tabActive]}
          onPress={() => setSelectedTab('market')}>
          <Ionicons
            name="trending-up"
            size={20}
            color={selectedTab === 'market' ? '#2D6A4F' : '#666'}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === 'market' && styles.tabTextActive,
            ]}>
            Market
          </Text>
        </Pressable>
      </View>

      {selectedTab === 'weather' && renderWeatherSection()}
      {selectedTab === 'crop' && renderCropSection()}
      {selectedTab === 'market' && renderMarketSection()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 8,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#E8F5E9',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#2D6A4F',
  },
  weatherCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: '600',
  },
  weatherCondition: {
    fontSize: 16,
    color: '#666',
  },
  weatherDetails: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherDetailText: {
    marginLeft: 8,
    color: '#666',
  },
  forecastContainer: {
    marginTop: 24,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  forecastDay: {
    alignItems: 'center',
    marginRight: 24,
  },
  forecastDate: {
    color: '#666',
    marginBottom: 8,
  },
  forecastTemp: {
    marginTop: 8,
    fontWeight: '600',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  alertCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB800',
  },
  alertContent: {
    marginLeft: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertText: {
    color: '#666',
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2D6A4F',
    borderStyle: 'dashed',
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2D6A4F',
  },
  analysisCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  analysisImage: {
    width: '100%',
    height: 200,
  },
  analysisContent: {
    padding: 16,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  analysisDate: {
    color: '#666',
    marginBottom: 12,
  },
  healthIndicator: {
    marginBottom: 12,
  },
  healthBar: {
    height: 8,
    backgroundColor: '#2D6A4F',
    borderRadius: 4,
    marginBottom: 4,
  },
  healthText: {
    color: '#666',
  },
  analysisDetails: {
    color: '#444',
    lineHeight: 20,
  },
  marketCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  marketTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  priceItem: {
    marginBottom: 16,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '500',
  },
  priceChange: {
    color: '#2D6A4F',
    fontWeight: '600',
  },
  priceDown: {
    color: '#FF4444',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationContent: {
    marginLeft: 12,
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationText: {
    color: '#666',
    lineHeight: 20,
  },
  soilMoistureContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  soilMoistureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  soilMoistureBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  soilMoistureFill: {
    height: '100%',
    backgroundColor: '#2D6A4F',
    borderRadius: 4,
  },
  soilMoistureText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2D6A4F',
    gap: 8,
  },
  actionButtonText: {
    color: '#2D6A4F',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: '500',
  },
  treatmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  treatmentDate: {
    color: '#666',
    fontSize: 14,
  },
  treatmentType: {
    color: '#2D6A4F',
    fontWeight: '500',
  },
  treatmentDetails: {
    color: '#444',
    lineHeight: 20,
  },
  priceChart: {
    flexDirection: 'row',
    height: 40,
    gap: 8,
    marginTop: 8,
    alignItems: 'flex-end',
  },
  chartBar: {
    flex: 1,
    height: 35,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
  },
  recommendationStats: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D6A4F',
  },
});