import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';

const Pharmacy = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [region, setRegion] = useState({
    latitude: 54.2766, // Default location
    longitude: -8.4761,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Fetch pharmacies from Laravel backend
  useEffect(() => {
    axios.get('http://your-laravel-backend/api/pharmacies')
      .then(response => {
        setPharmacies(response.data);
        setFilteredPharmacies(response.data); // Initialize filtered list
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Handle search input
  const updateSearch = (query) => {
    setSearchQuery(query);
    const filtered = pharmacies.filter(pharmacy =>
      pharmacy.name.toLowerCase().includes(query.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPharmacies(filtered);

    if (filtered.length > 0) {
      const firstResult = filtered[0];
      setRegion({
        latitude: firstResult.latitude,
        longitude: firstResult.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar for finding pharmacies */}
      <SearchBar
        placeholder="Search Pharmacy"
        onChangeText={updateSearch}
        value={searchQuery}
        containerStyle={styles.searchBarContainer}
      />

      {/* Map View displaying pharmacies */}
      <MapView
        style={{ flex: 1 }}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {filteredPharmacies.map((pharmacy, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: pharmacy.latitude,
              longitude: pharmacy.longitude,
            }}
            title={pharmacy.name}
            description={pharmacy.address}
            onPress={() => setSelectedPharmacy(pharmacy)}
          />
        ))}
      </MapView>

      {/* Selected pharmacy details (if any) */}
      {selectedPharmacy && (
        <View style={styles.selectedPharmacyContainer}>
          <Text>{selectedPharmacy.name}</Text>
          <Text>{selectedPharmacy.address}</Text>
          <Text>{selectedPharmacy.email}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  selectedPharmacyContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
  },
});

export default Pharmacy;
