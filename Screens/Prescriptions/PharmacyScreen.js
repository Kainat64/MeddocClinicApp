import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BaseUrl } from '../../Utils/BaseApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color } from '../../GlobalStyles';

const PharmacyListScreen = ({ route, navigation }) => {
  const { appointmentId, patientId, patientName, medicinesIds, prescriptionDetails } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null); // Changed to single selection
  const [pharmacies, setPharmacies] = useState([]);

  const searchPharmacies = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/get-pharmacies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { query: searchQuery }
      });
      setPharmacies(response.data);
    } catch (error) {
      console.error('Error fetching Pharmacies', error);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchPharmacies();
    } else {
      searchPharmacies(); // Or setPharmacies([]) if you want to clear when search is too short
    }
  }, [searchQuery]);

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (pharmacy) => {
    if (selectedPharmacy && selectedPharmacy.id === pharmacy.id) {
      setSelectedPharmacy(null); // Deselect if same pharmacy clicked
    } else {
      setSelectedPharmacy(pharmacy); // Select new pharmacy
    }
  };

  const handleConfirm = () => {
    if (!selectedPharmacy) {
      Alert.alert("Selection Required", "Please select a pharmacy to continue");
      return;
    }
    
    navigation.navigate('Summary', {
      appointmentId,
      patientId,
      patientName,
      medicinesIds,
      prescriptionDetails,
      selectedPharmacy: selectedPharmacy.id, // Pass only the ID if that's what you need
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Pharmacy"
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView>
        {filteredPharmacies.map(pharmacy => (
          <View key={pharmacy.id} style={styles.testCard}>
            <FontAwesome
              name="medkit"
              size={36}
              color={Color.blue1}
              style={styles.icon}
            />
            <View style={styles.testInfo}>
              <Text style={styles.testName}>{pharmacy.name}</Text>
              <Text style={styles.reportTime}>
                Location: {pharmacy.google_address}
              </Text>
              <Text style={styles.reportTime}>
                Contact: {pharmacy.contact_no}
              </Text>
              <Text style={styles.reportTime}>Email: {pharmacy.email}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleSelection(pharmacy)}>
              <FontAwesome
                name={
                  selectedPharmacy?.id === pharmacy.id
                    ? 'check-circle'
                    : 'circle-o'
                }
                size={24}
                color={
                  selectedPharmacy?.id === pharmacy.id ? '#4CAF50' : '#ccc'
                }
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.actionButtons}>
       
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.navigate('Prescription', {
              appointmentId,
              patientId,
              patientName,
              medicinesIds,
              prescriptionDetails,
            })
          }>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.reviewButton, 
            !selectedPharmacy && styles.disabledButton
          ]} 
          onPress={handleConfirm}
          disabled={!selectedPharmacy}
        >
          <Text style={styles.buttonText}>Next</Text>
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
    color: '#333',
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
    color: Color.blue1,
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
    backgroundColor: '#fff',
  },
  reviewButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
    opacity: 0.6,
  },
  backButton: {
    flex: 1,
    backgroundColor: Color.blue1,
    paddingVertical: 12,
    borderRadius: 5,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PharmacyListScreen;