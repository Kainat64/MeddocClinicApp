import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BaseUrl } from '../../Utils/BaseApi';
import axios from 'axios';

const AvailableMedicine = ({ route, navigation }) => {
 
  const { 
    appointmentId, patientId, patientName,  selectedMedicines: initialSelected = [] } = route.params || {};
  console.log(appointmentId, patientId, patientName);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicines, setSelectedMedicines] = useState(initialSelected);
  const [medicines, setMedicines] = useState([]);

  const searchMedicines = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/get-medicines-list`, {
        params: { query: searchQuery },
      });
      setMedicines(response.data);
      console.log("medicine list", response.data);
    } catch (error) {
      console.error('Error fetching medicines', error);
    }
  };

  useEffect(() => {
    searchMedicines();
    if (searchQuery.length > 2) {
      searchMedicines();
    }
  }, [searchQuery]);

  const filteredMedicine = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (medicine) => {
    const exists = selectedMedicines.find((item) => item.id === medicine.id);
    if (exists) {
      setSelectedMedicines((prev) =>
        prev.filter((item) => item.id !== medicine.id)
      );
    } else {
      setSelectedMedicines((prev) => [
        ...prev,
        {
          id: medicine.id,
          name: medicine.name,
        },
      ]);
    }
  };

  const isSelected = (id) =>
    selectedMedicines.some((medicine) => medicine.id === id);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Medicine"
         placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <ScrollView>
        {filteredMedicine.map((medicine) => (
          <View key={medicine.id} style={styles.testCard}>
            <View style={styles.medicineInfo}>
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text style={styles.reportTime}>
                Category: {medicine.category?.title || ''}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleSelection(medicine)}>
              <FontAwesome
                name={
                  isSelected(medicine.id) ? 'check-circle' : 'circle-o'
                }
                size={24}
                color={isSelected(medicine.id) ? '#4CAF50' : '#ccc'}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.actionButtons}>
   

        <TouchableOpacity style={styles.confirmButton}
         onPress={()=>navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
           <TouchableOpacity
        style={[
          styles.reviewButton,
          selectedMedicines.length === 0 && styles.disabledButton
        ]}
        onPress={() => navigation.navigate('Prescription', {
          appointmentId,
          patientId,
          medicinesIds: selectedMedicines,
          patientName
        })}
        disabled={selectedMedicines.length === 0}
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
    color:'#222831',
  },
  testCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  medicineInfo: {
    flex: 1,
    marginRight: 10,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
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
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  }
  
});

export default AvailableMedicine;
