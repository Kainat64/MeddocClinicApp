import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BaseUrl } from '../../Utils/BaseApi';
import axios from 'axios';
import { Color } from '../../GlobalStyles';

const PrescriptionScreen = ({ route, navigation }) => {
  const { appointmentId, patientId, patientName, medicinesIds = [] } = route.params || {};
  const [medicines, setMedicines] = useState([]);
  const [prescriptionDetails, setPrescriptionDetails] = useState([]);

  // Fetch medicine details whenever medicinesIds changes
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const medicineDetails = await Promise.all(
          medicinesIds.map(async (medicine) => {
            const response = await axios.get(`${BaseUrl}/get-single-medicine/${medicine.id}`);
            return response.data;
          })
        );
        setMedicines(medicineDetails);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    if (medicinesIds.length > 0) {
      fetchMedicines();
    }
  }, [medicinesIds]);

  // Sync prescription details when medicinesIds or fetched medicines change
  useEffect(() => {
    const currentMedIds = prescriptionDetails.map(med => med.medicineId);
    const newMedIds = medicinesIds.map(med => med.id);
    const fetchedMedMap = new Map(medicines.map(med => [med.id, med]));

    // Update existing entries with fetched data where applicable
    const updatedDetails = prescriptionDetails
      .filter(med => newMedIds.includes(med.medicineId))
      .map(med => {
        const fetchedMed = fetchedMedMap.get(med.medicineId);
        return fetchedMed ? {
          ...med,
          medicineName: med.medicineName || fetchedMed.name,
          frequency: med.frequency.startsWith('1-0-1') ? fetchedMed.frequency || med.frequency : med.frequency,
          duration: med.duration.startsWith('5 days') ? fetchedMed.duration || med.duration : med.duration,
          dosage: med.dosage.startsWith('500mg') ? fetchedMed.dosage || med.dosage : med.dosage,
        } : med;
      });

    // Add new medicines from medicinesIds
    const addedMedicines = medicinesIds
      .filter(med => !currentMedIds.includes(med.id))
      .map(med => {
        const fetchedMed = fetchedMedMap.get(med.id);
        return {
          medicineId: med.id,
          medicineName: fetchedMed?.name || med.name || '',
          frequency: fetchedMed?.frequency || '1-0-1',
          duration: fetchedMed?.duration || '5 days',
          dosage: fetchedMed?.dosage || '500mg',
        };
      });

    setPrescriptionDetails([...updatedDetails, ...addedMedicines]);
  }, [medicinesIds, medicines]);

  const handleInputChange = (index, field, value) => {
    const updatedDetails = [...prescriptionDetails];
    updatedDetails[index][field] = value;
    setPrescriptionDetails(updatedDetails);
  };

  const handleConfirm = () => {
    navigation.navigate('Pharmacies List', {
      appointmentId,
      patientId,
      patientName,
      medicinesIds,
      prescriptionDetails,
    });
  };

  return (
    <View style={{ flex: 1}}>
      <ScrollView style={[styles.container, { marginBottom: 80 }]}>
        {prescriptionDetails.map((med, index) => (
          <View key={index} style={styles.medicineContainer}>
            <Text style={styles.medicineName}>{med.medicineName}</Text>
            <TextInput
              style={styles.input}
              placeholder="Frequency (e.g., 2 times a day)"
              value={med.frequency}
              onChangeText={(text) => handleInputChange(index, 'frequency', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Duration (e.g., 7 days)"
              value={med.duration}
              onChangeText={(text) => handleInputChange(index, 'duration', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage (e.g., 500mg)"
              value={med.dosage}
              onChangeText={(text) => handleInputChange(index, 'dosage', text)}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.nextButton]}
          onPress={handleConfirm}
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
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  medicineContainer: {
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#274A8A',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50, // Ensure consistent touch area
  },
  nextButton: {
    backgroundColor:'#4CAF50',
  },
  backButton: {
    backgroundColor: Color.blue1, 
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});

export default PrescriptionScreen;
