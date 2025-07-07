import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // FontAwesome import
import { BaseUrl } from '../../Utils/BaseApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PharmacyListScreen = ({ route, navigation }) => {
  const { patientId, medicinesIds,prescriptionDetails } = route.params; // Get the selected patient from the previous screen
  console.log('summary:', prescriptionDetails);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);

  const searchPharmacies = async () => {
    try {
        const token  = await AsyncStorage.getItem('userToken');

      const response = await axios.get(`${BaseUrl}/get-pharmacies`, {
        headers: {
            Authorization: `Bearer ${token}`, // Add token in headers
          },
        params: { query: searchQuery }
      });
      setPharmacies(response.data);
     // console.log('Pharmacies list: ', response.data);
    } catch (error) {
      console.error('Error fetching Pharmacies', error);
    }
  };

  useEffect(() => {
    searchPharmacies();
    if (searchQuery.length > 2) {
        searchPharmacies();
    }
  }, [searchQuery]);

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (pharmacyId) => {
    if (selectedPharmacy.includes(pharmacyId)) {
      setSelectedPharmacy(selectedPharmacy.filter(id => id !== pharmacyId));
    } else {
        setSelectedPharmacy([...selectedPharmacy, pharmacyId]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Pharmacy"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />

      <ScrollView>
        {filteredPharmacies.map(pharmacy => (
          <View key={pharmacy.id} style={styles.testCard}>
            <FontAwesome
              name="medkit"
              size={36}
              color="#003366"
              style={styles.icon}
            />
            <View style={styles.testInfo}>
              <Text style={styles.testName}>{pharmacy.name}</Text>
              <Text style={styles.reportTime}>Location: {pharmacy.google_address}</Text>
              <Text style={styles.reportTime}>Contact: {pharmacy.contact_no}</Text>
              <Text style={styles.reportTime}>Email: {pharmacy.email}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleSelection(pharmacy.id)}>
              <FontAwesome
                name={selectedPharmacy.includes(pharmacy.id) ? 'check-circle' : 'circle-o'}
                size={24}
                color={selectedPharmacy.includes(pharmacy.id) ? '#4CAF50' : '#ccc'}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.reviewButton}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  testCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  icon: {
    marginRight: 16,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color:'#274A8A',
  },
  reportTime: {
    color: '#666',
    marginBottom: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  reviewButton: {
    flex: 1,
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 5,
    marginRight: 8,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PharmacyListScreen;
