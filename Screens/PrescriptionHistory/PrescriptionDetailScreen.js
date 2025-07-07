import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Touchable, TouchableOpacity } from 'react-native';
import { BaseUrl } from '../../Utils/BaseApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PrescriptionDetailScreen = ({ route, navigation }) => {
  const { prescriptionId } = route.params;
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptionDetails();
    const intervalId = setInterval(fetchPrescriptionDetails, 3000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchPrescriptionDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/get-prescription-detail/${prescriptionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrescriptionDetails(response.data);
      console.log('Prescription Details:', response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prescription details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1f6f78" style={styles.loading} />;
  }

  if (!prescriptionDetails) {
    return <Text style={styles.errorText}>No details available.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <TouchableOpacity  onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="chevron-left" size={20} color="#333" style={styles.backIcon} />
        <Text style={styles.title}>Prescription Details</Text>
      </TouchableOpacity>
      

      {/* Patient and Pharmacy Info */}
      <View style={styles.infoContainer}>
        <FontAwesome name="user" size={20} color="#333" style={styles.icon} />
        <Text style={styles.label}>Patient: {prescriptionDetails.patient_name.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome name="calendar" size={20} color="#333" style={styles.icon} />
        <Text style={styles.label}>Date: {prescriptionDetails.date}</Text>
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome name="calendar" size={20} color="#f76b8a" style={styles.icon} />
        <Text style={styles.label}>Next Appointment Date: {prescriptionDetails.next_appointment_date}</Text>
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome name="building" size={20} color="#333" style={styles.icon} />
        <Text style={styles.label}>Pharmacy: {prescriptionDetails.pharmacy.name}</Text>
      </View>

      {/* Medications Section */}
      <View style={styles.section}>
  <Text style={styles.sectionTitle}>Medications</Text>
  {prescriptionDetails.medications.map((med, index) => (
    <View key={index} style={styles.card}>
      <Text style={styles.medicineName}>{med.medicine_name}</Text>
      
      <View style={styles.row}>
        <FontAwesome name="medkit" size={16} color="#1f6f78" style={styles.iconLeft} />
        <Text style={styles.detailText}>Dosage: {med.dosage}</Text>
      </View>

      <View style={styles.row}>
        <FontAwesome name="repeat" size={16} color="#1f6f78" style={styles.iconLeft} />
        <Text style={styles.detailText}>Frequency: {med.frequency}</Text>
      </View>

      <View style={styles.row}>
        <FontAwesome name="clock-o" size={16} color="#1f6f78" style={styles.iconLeft} />
        <Text style={styles.detailText}>Duration: {med.duration}</Text>
      </View>
    </View>
  ))}
</View>


    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fc',
    padding: 16,

  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f6f78',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f6f78',
    marginBottom: 10,
    textAlign: 'left',
  },
  medicationItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medicationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#eaf6f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 12,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  iconLeft: {
    marginRight: 10,
  },
  
  detailText: {
    fontSize: 16,
    color: '#555',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
  },
  backIcon: {
    marginRight: 20,
    marginTop: -10,
  },
  
});

export default PrescriptionDetailScreen;
