import React, { useState, useEffect } from 'react';
import { BaseUrl } from '../../Utils/BaseApi';
import axios from 'axios';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker'; // Add this import
import { Color } from '../../GlobalStyles';

const SummaryScreen = ({ route }) => {
  const navigation = useNavigation();
  const {appointmentId, patientId, patientName, medicinesIds, prescriptionDetails, selectedPharmacy } = route.params;
  console.log('patient name:', patientName);
  console.log(appointmentId);
  const [medicines, setMedicines] = useState([]);
  const [pharmacy, setPharmacy] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [nextAppointmentDate, setNextAppointmentDate] = useState(new Date()); // State for date
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility

  useEffect(() => {
    if (medicinesIds.length > 0) {
      fetchMedicines();
    }
    fetchPharmacy();
    fetchUser();
  }, []);
 
  const fetchMedicines = async () => {
    try {
      const medicineDetails = await Promise.all(
        medicinesIds.map(async (medicineId) => {
          const url = `${BaseUrl}/get-single-medicine/${medicineId}`;
          console.log("Fetching from URL:", url);
          const response = await axios.get(url);
          return response.data;
        })
      );
      setMedicines(medicineDetails);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = `${BaseUrl}/get-single-user/${patientId}`;
      console.log("Fetching from URL:", url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });
      setUser(response.data);
      console.log('user:', response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchPharmacy = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = `${BaseUrl}/get-single-pharmacy/${selectedPharmacy}`;
      console.log("Fetching from URL:", url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });
      setPharmacy(response.data);
      console.log('pharmacy:', response.data.name);
    } catch (error) {
      console.error('Error fetching pharmacy:', error);
    }
  };

  const fetchPrescriptionDetails = medicines.map((medicine, index) => ({
    medicine_id: medicine?.id || null,
    dosage: prescriptionDetails[index]?.dosage || '',
    frequency: prescriptionDetails[index]?.frequency || '',
    duration: prescriptionDetails[index]?.duration || '',
  }));
  
  console.log('fetchPrescriptionDetails:', fetchPrescriptionDetails);
  
  // Date picker change handler
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNextAppointmentDate(selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // save prescription with next appointment date
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = `${BaseUrl}/save-prescription-detail`;
      
      const response = await axios.post(
        url,
        {
          appointmentId,
          patientId,
          pharmacyId: pharmacy.id,
          prescriptionDetails,
          medicines: medicines.map(m => m.name),
          fetchPrescriptionDetails,
          nextAppointmentDate: nextAppointmentDate.toISOString(), // Send the date in ISO format
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Prescription saved and receipt generated. Email sent to the user.");
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      Alert.alert("Error", "There was an error saving the prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backIcon}
          />
          <Text style={styles.headerTitle}>Prescription Summary</Text>
        </View>

        {/* Patient Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            {/* <FontAwesome name="user" size={18} color={Color.blue1} style={styles.icon} /> */}
            <Text style={styles.cardTitle}>Patient Information</Text>
          </View>
          <View style={styles.patientInfo}>
            {user.image_url && (
  <Image
    source={{ uri: user.image_url }}
    style={styles.profileImage}
    resizeMode="cover"
    onError={() => console.log('Image failed to load')}
  />
)}

            <View style={styles.patientTextContainer}>
              <Text style={styles.patientName}>{patientName}</Text>
              <Text style={styles.patientId}>ID: {patientId}</Text>
            </View>
          </View>
        </View>

        {/* Pharmacy Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selected Pharmacy</Text>
          <View style={styles.pharmacyInfo}>
            <FontAwesome name="building" size={20} color={Color.blue1} />
            <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
          </View>
          {pharmacy.address && (
            <View style={styles.pharmacyAddress}>
              <FontAwesome name="map-marker" size={16} color="#666" />
              <Text style={styles.addressText}>{pharmacy.address}</Text>
            </View>
          )}
        </View>

        {/* Next Appointment Date Picker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Appointment</Text>
          <View style={styles.pharmacyInfo}>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <FontAwesome name="calendar" size={20} color={Color.blue1}  style={styles.icon} />
            <Text style={styles.dateText}>
              {formatDate(nextAppointmentDate)}
            </Text>
          </TouchableOpacity></View>
          {showDatePicker && (
            <DateTimePicker
              value={nextAppointmentDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()} // Prevent selecting past dates
            />
          )}
        </View>

        {/* Prescriptions */}
        <Text style={styles.sectionTitle}>Prescribed Medicines</Text>
        {medicines.map((medicine, index) => {
          const prescription = prescriptionDetails[index];
          return (
            <View key={index} style={styles.medicineCard}>
              <View style={styles.medicineHeader}>
                <FontAwesome name="medkit" size={20} color={Color.blue1} />
                <Text style={styles.medicineName}>{medicine.name}</Text>
              </View>
              <View style={styles.prescriptionDetail}>
                <Text style={styles.detailLabel}>Dosage:</Text>
                <Text style={styles.detailValue}>{prescription.dosage}</Text>
              </View>
              <View style={styles.prescriptionDetail}>
                <Text style={styles.detailLabel}>Frequency:</Text>
                <Text style={styles.detailValue}>{prescription.frequency}</Text>
              </View>
              <View style={styles.prescriptionDetail}>
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>{prescription.duration}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => navigation.navigate('Pharmacies List', {
            appointmentId,
            patientId,
            patientName,
            medicinesIds,
            prescriptionDetails,
            selectedPharmacy,
          })}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.confirmButton]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirm & Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  header: {
    backgroundColor: Color.blue1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.blue1,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  patientTextContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
  
  
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  patientId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  pharmacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  pharmacyAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.blue1,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  medicineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  prescriptionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Color.blue1,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
});

export default SummaryScreen;