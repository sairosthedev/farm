import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

// Types
type WeatherData = {
  temp: number;
  condition: string;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  uvIndex: number;
  soilMoisture: number;
};

type AlertItem = {
  type: 'weather' | 'pest' | 'market';
  title: string;
  description: string;
  severity: 'low' | 'warning' | 'high';
};

type CropHealthMetrics = {
  overallHealth: number;
  leafColor: string;
  pestDamage: number;
  diseaseRisk: number;
  nutrientDeficiencies: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  recommendations: string[];
};

type CropAnalysis = {
  id: string;
  image: string;
  title: string;
  date: string;
  health: number;
  details: string;
  metrics?: CropHealthMetrics;
};

type AgronomyTip = {
  id: string;
  title: string;
  description: string;
  category: 'soil' | 'pest' | 'irrigation' | 'fertilizer' | 'general';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
};

type WeatherForecast = {
  date: string;
  temp: number;
  condition: string;
  rainChance: number;
};

export default function AdvisoryScreen() {
  const [weather, setWeather] = useState<WeatherData>({
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
  const [alerts, setAlerts] = useState<AlertItem[]>([
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

  const [cropAnalyses, setCropAnalyses] = useState<CropAnalysis[]>([
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1599493006232-b7e6c446b923?q=80&w=600',
      title: 'Maize Leaf Analysis',
      date: 'March 15, 2024',
      health: 85,
      details: 'Minor signs of nitrogen deficiency detected. Consider applying supplementary nitrogen fertilizer.'
    }
  ]);

  const [agronomyTips, setAgronomyTips] = useState<AgronomyTip[]>([
    {
      id: '1',
      title: 'Optimal Planting Time',
      description: 'Based on current soil moisture levels and weather forecast, the next 48 hours present ideal conditions for maize planting.',
      category: 'general',
      priority: 'high',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Soil pH Adjustment Needed',
      description: 'Recent analysis indicates slightly acidic soil conditions. Consider applying agricultural lime at 2 tons/ha.',
      category: 'soil',
      priority: 'medium',
      timestamp: new Date().toISOString()
    }
  ]);

  const [forecast, setForecast] = useState<WeatherForecast[]>([]);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Please grant location access to get weather updates for your area.');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
        // Fetch weather data
        await fetchWeatherData(location);
        await fetchWeatherForecast(location);
        generateAgronomyTips();
      } catch (error) {
        Alert.alert('Error', 'Failed to get location or weather data.');
      }
    })();
  }, []);

  const fetchWeatherData = async (location: Location.LocationObject) => {
    try {
      // Replace with your actual weather API call
      // For demo, we'll simulate an API call
      const response = await new Promise<WeatherData>((resolve) => {
        setTimeout(() => {
          resolve({
            temp: Math.floor(Math.random() * (35 - 20) + 20),
            condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * (80 - 40) + 40),
            rainChance: Math.floor(Math.random() * 100),
            windSpeed: Math.floor(Math.random() * (20 - 5) + 5),
            uvIndex: Math.floor(Math.random() * (11 - 1) + 1),
            soilMoisture: Math.floor(Math.random() * (80 - 20) + 20),
          });
        }, 1000);
      });

      setWeather(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch weather data.');
    }
  };

  const fetchWeatherForecast = async (location: Location.LocationObject) => {
    try {
      // Simulate API call for 5-day forecast
      const response = await new Promise<WeatherForecast[]>((resolve) => {
        setTimeout(() => {
          const forecasts = Array.from({ length: 5 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i + 1);
            return {
              date: date.toLocaleDateString(),
              temp: Math.floor(Math.random() * (35 - 20) + 20),
              condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
              rainChance: Math.floor(Math.random() * 100)
            };
          });
          resolve(forecasts);
        }, 1000);
      });

      setForecast(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch weather forecast.');
    }
  };

  const generateAgronomyTips = async () => {
    try {
      // Simulate AI analysis based on weather and soil conditions
      const newTip: AgronomyTip = {
        id: Date.now().toString(),
        title: 'Irrigation Recommendation',
        description: `Based on current soil moisture (${weather.soilMoisture}%) and tomorrow's rain chance (${forecast[0]?.rainChance}%), irrigation is ${weather.soilMoisture < 40 && forecast[0]?.rainChance < 50 ? 'recommended' : 'not needed'}.`,
        category: 'irrigation',
        priority: weather.soilMoisture < 30 ? 'high' : 'medium',
        timestamp: new Date().toISOString()
      };

      setAgronomyTips(prev => [newTip, ...prev]);
    } catch (error) {
      console.error('Failed to generate agronomy tips:', error);
    }
  };

  const analyzeCropImage = async (imageUri: string): Promise<CropHealthMetrics> => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const healthScore = Math.floor(Math.random() * (100 - 60) + 60);
    const leafColors = ['Dark Green', 'Light Green', 'Yellowish', 'Brown Spots'];
    const pestDamage = Math.floor(Math.random() * 100);
    const diseaseRisk = Math.floor(Math.random() * 100);
    
    const metrics: CropHealthMetrics = {
      overallHealth: healthScore,
      leafColor: leafColors[Math.floor(Math.random() * leafColors.length)],
      pestDamage: pestDamage,
      diseaseRisk: diseaseRisk,
      nutrientDeficiencies: {
        nitrogen: Math.floor(Math.random() * 100),
        phosphorus: Math.floor(Math.random() * 100),
        potassium: Math.floor(Math.random() * 100),
      },
      recommendations: []
    };

    // Generate recommendations based on analysis
    if (metrics.nutrientDeficiencies.nitrogen < 50) {
      metrics.recommendations.push('Apply nitrogen-rich fertilizer');
    }
    if (metrics.nutrientDeficiencies.phosphorus < 50) {
      metrics.recommendations.push('Supplement with phosphate fertilizer');
    }
    if (metrics.nutrientDeficiencies.potassium < 50) {
      metrics.recommendations.push('Add potassium-based fertilizer');
    }
    if (pestDamage > 30) {
      metrics.recommendations.push('Inspect for pest infestation and consider appropriate pesticide application');
    }
    if (diseaseRisk > 50) {
      metrics.recommendations.push('Monitor for disease progression and consider preventive fungicide treatment');
    }

    return metrics;
  };

  const handleImageAnalysis = async (imageUri: string, source: 'camera' | 'library') => {
    try {
      // Show analysis in progress
      const initialAnalysis: CropAnalysis = {
        id: Date.now().toString(),
        image: imageUri,
        title: 'Analysis in Progress',
        date: new Date().toLocaleDateString(),
        health: 0,
        details: 'Analyzing crop health...',
      };

      setCropAnalyses(prev => [initialAnalysis, ...prev]);

      // Perform AI analysis
      const metrics = await analyzeCropImage(imageUri);

      // Update analysis with results
      const updatedAnalysis: CropAnalysis = {
        ...initialAnalysis,
        title: `Crop Analysis Report`,
        health: metrics.overallHealth,
        details: `Leaf Color: ${metrics.leafColor}\nPest Damage Risk: ${metrics.pestDamage}%\nDisease Risk: ${metrics.diseaseRisk}%`,
        metrics: metrics,
      };

      setCropAnalyses(prev => [
        updatedAnalysis,
        ...prev.filter(a => a.id !== initialAnalysis.id)
      ]);

      // Generate agronomy tip based on analysis
      if (metrics.recommendations.length > 0) {
        const newTip: AgronomyTip = {
          id: Date.now().toString(),
          title: 'Crop Health Alert',
          description: metrics.recommendations.join('. '),
          category: 'general',
          priority: metrics.overallHealth < 70 ? 'high' : 'medium',
          timestamp: new Date().toISOString()
        };
        setAgronomyTips(prev => [newTip, ...prev]);
      }

      Alert.alert(
        'Analysis Complete',
        `Overall Health: ${metrics.overallHealth}%\n${metrics.recommendations[0] || 'No immediate actions required.'}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze image.');
    }
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Please grant camera roll access to analyze crop images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        await handleImageAnalysis(result.assets[0].uri, 'library');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image.');
    }
  };

  const handleCameraCapture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Please grant camera access to capture crop images.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        await handleImageAnalysis(result.assets[0].uri, 'camera');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image.');
    }
  };

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
            {forecast.map((day, index) => (
              <View key={index} style={styles.forecastDay}>
                <Text style={styles.forecastDate}>{day.date}</Text>
                <Ionicons 
                  name={
                    day.condition.toLowerCase().includes('rain')
                      ? 'rainy'
                      : day.condition.toLowerCase().includes('cloud')
                      ? 'partly-sunny'
                      : 'sunny'
                  }
                  size={24}
                  color="#2D6A4F"
                />
                <Text style={styles.forecastTemp}>{day.temp}°C</Text>
                <Text style={styles.rainChance}>{day.rainChance}% rain</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Agronomy Tips</Text>
        <ScrollView style={styles.tipsContainer}>
          {agronomyTips.map((tip) => (
            <View 
              key={tip.id} 
              style={[
                styles.tipCard,
                { borderLeftColor: 
                  tip.priority === 'high' 
                    ? '#FF4444' 
                    : tip.priority === 'medium' 
                    ? '#FFB800' 
                    : '#2D6A4F' 
                }
              ]}
            >
              <View style={styles.tipHeader}>
                <View style={styles.tipCategory}>
                  <Ionicons 
                    name={
                      tip.category === 'soil' 
                        ? 'leaf' 
                        : tip.category === 'pest' 
                        ? 'bug' 
                        : tip.category === 'irrigation' 
                        ? 'water'
                        : tip.category === 'fertilizer'
                        ? 'flask'
                        : 'information-circle'
                    } 
                    size={20} 
                    color="#2D6A4F" 
                  />
                  <Text style={styles.tipCategoryText}>{tip.category.toUpperCase()}</Text>
                </View>
                <Text style={styles.tipTimestamp}>
                  {new Date(tip.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          ))}
        </ScrollView>
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
          <Pressable style={styles.actionButton} onPress={handleCameraCapture}>
            <Ionicons name="camera" size={24} color="#2D6A4F" />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleImagePicker}>
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
          {cropAnalyses.map((analysis) => (
            <Pressable 
              key={analysis.id} 
              style={styles.analysisCard}
              onPress={() => {
                if (analysis.metrics) {
                  Alert.alert(
                    'Detailed Analysis',
                    `Overall Health: ${analysis.metrics.overallHealth}%\n` +
                    `Leaf Color: ${analysis.metrics.leafColor}\n` +
                    `Pest Damage Risk: ${analysis.metrics.pestDamage}%\n` +
                    `Disease Risk: ${analysis.metrics.diseaseRisk}%\n\n` +
                    'Nutrient Levels:\n' +
                    `Nitrogen: ${analysis.metrics.nutrientDeficiencies.nitrogen}%\n` +
                    `Phosphorus: ${analysis.metrics.nutrientDeficiencies.phosphorus}%\n` +
                    `Potassium: ${analysis.metrics.nutrientDeficiencies.potassium}%\n\n` +
                    'Recommendations:\n' +
                    analysis.metrics.recommendations.join('\n')
                  );
                }
              }}
            >
              <Image
                source={{ uri: analysis.image }}
                style={styles.analysisImage}
                contentFit="cover"
              />
              <View style={styles.analysisContent}>
                <Text style={styles.analysisTitle}>{analysis.title}</Text>
                <Text style={styles.analysisDate}>{analysis.date}</Text>
                <View style={styles.healthIndicator}>
                  <View style={[styles.healthBar, { width: `${analysis.health}%` }]} />
                  <Text style={styles.healthText}>Health: {analysis.health}%</Text>
                </View>
                <Text style={styles.analysisDetails}>{analysis.details}</Text>
                {analysis.metrics && (
                  <View style={styles.metricsContainer}>
                    <View style={styles.metricItem}>
                      <Ionicons name="bug" size={16} color="#666" />
                      <Text style={styles.metricText}>Pest: {analysis.metrics.pestDamage}%</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Ionicons name="warning" size={16} color="#666" />
                      <Text style={styles.metricText}>Disease: {analysis.metrics.diseaseRisk}%</Text>
                    </View>
                  </View>
                )}
              </View>
            </Pressable>
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
  rainChance: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tipsContainer: {
    maxHeight: 300,
  },
  tipCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipCategoryText: {
    fontSize: 12,
    color: '#2D6A4F',
    fontWeight: '600',
  },
  tipTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDescription: {
    color: '#444',
    lineHeight: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: '#666',
  },
});