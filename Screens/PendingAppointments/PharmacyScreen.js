import React, { useState, useEffect } from 'react';
import {TextInput, View, Text, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const PharmacyScreen = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    axios.get('http://your-laravel-backend/api/pharmacies')
      .then(response => {
        setPharmacies(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 54.2766, // Coordinates of your default location
          longitude: -8.4761,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {pharmacies.map((pharmacy, index) => (
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

      {selectedPharmacy && (
        <View style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white' }}>
          <Text>{selectedPharmacy.name}</Text>
          <Text>{selectedPharmacy.address}</Text>
          <Text>{selectedPharmacy.email}</Text>
        </View>
      )}
          <TextInput
              placeholder="Search Pharmacy"
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
              style={{ padding: 10, backgroundColor: '#f0f0f0' }}
          />

          <FlatList
              data={filteredPharmacies}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => setSelectedPharmacy(item)}>
                      <Text>{item.name}</Text>
                      <Text>{item.address}</Text>
                  </TouchableOpacity>
              )}
          />
    </View>
    
  );
};

export default PharmacyScreen;
