import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from '@react-native-community/geolocation';
import { Configuration, OpenAIApi } from 'openai';
import { MAPBOX_ACCESS_TOKEN, OPENAI_API_KEY } from '@env';

// Initialize Mapbox
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface Location {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  category: string;
}

const App = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [funFact, setFunFact] = useState<string>('');
  const [userLocation, setUserLocation] = useState<[number, number]>([18.0686, 59.3293]); // Default to Stockholm

  useEffect(() => {
    // Load locations from JSON file
    const loadLocations = async () => {
      try {
        const locationsData = require('./data/locations.json');
        setLocations(locationsData.locations);
      } catch (error) {
        Alert.alert('Error', 'Failed to load locations');
      }
    };

    // Request location permissions and get user location
    const getUserLocation = () => {
      Geolocation.requestAuthorization();
      Geolocation.getCurrentPosition(
        position => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        error => {
          Alert.alert('Error', 'Failed to get your location');
        }
      );
    };

    loadLocations();
    getUserLocation();
  }, []);

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * locations.length);
    const location = locations[randomIndex];
    setSelectedLocation(location);
    setFunFact('');
  };

  const getFunFact = async () => {
    if (!selectedLocation) return;

    try {
      const response = await openai.createCompletion({
        model: "gpt-4",
        prompt: `You are a friendly tour guide. Give me one concise and interesting fun fact about "${selectedLocation.title}" in one sentence.`,
        max_tokens: 100,
        temperature: 0.7,
      });

      setFunFact(response.data.choices[0]?.text?.trim() || 'No fun fact available');
    } catch (error) {
      Alert.alert('Error', 'Failed to get fun fact');
    }
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={selectedLocation 
            ? [selectedLocation.longitude, selectedLocation.latitude]
            : userLocation}
        />
        
        {selectedLocation && (
          <MapboxGL.PointAnnotation
            id={selectedLocation.id}
            coordinate={[selectedLocation.longitude, selectedLocation.latitude]}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker} />
            </View>
          </MapboxGL.PointAnnotation>
        )}
      </MapboxGL.MapView>

      {selectedLocation && (
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{selectedLocation.title}</Text>
          {funFact ? (
            <Text style={styles.funFact}>{funFact}</Text>
          ) : (
            <TouchableOpacity style={styles.funFactButton} onPress={getFunFact}>
              <Text style={styles.funFactButtonText}>Get Fun Fact</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.surpriseButton} onPress={handleSurpriseMe}>
        <Text style={styles.surpriseButtonText}>Surprise me!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 30,
    height: 30,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
  },
  callout: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calloutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  funFact: {
    fontSize: 16,
    color: '#666',
  },
  funFactButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  funFactButtonText: {
    color: 'white',
    fontSize: 16,
  },
  surpriseButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  surpriseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;