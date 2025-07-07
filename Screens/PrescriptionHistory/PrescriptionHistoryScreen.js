import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import {BaseUrl} from '../../Utils/BaseApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width} = Dimensions.get('window');
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const PrescriptionHistoryScreen = ({navigation, route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  useEffect(() => {
    // Fetch immediately when component mounts
    fetchPrescription();
    
    // Set up interval to fetch every 5 seconds
    const intervalId = setInterval(fetchPrescription, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this runs once on mount
  const fetchPrescription = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/get-prescription-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrescriptions(response.data);
      //console.log('Prescription History:', response.data);
    } catch (error) {
      console.error('Error fetching prescription:', error);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescriptions =>
    prescriptions.patient.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <FontAwesome name="chevron-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescription History</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search my patients"
           placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>

      <ScrollView>
        {filteredPrescriptions.map(prescription => (
          <View key={prescription.id} style={styles.cardContainer}>
            <View style={styles.card}>
              <Image
                source={require('../../assets/images/avator.png')}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{prescription.appointment?.first_name}</Text>
                <View style={styles.hospitalRow}>
                  <FontAwesome
                    name="calendar"
                    size={20}
                    color="green"
                    style={styles.icon}
                  />
                  <Text style={styles.hospital}>Date: {prescription.date}</Text>
                </View>
                <View style={styles.hospitalRow}>
                  <FontAwesome
                    name="calendar"
                    size={20}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.hospital}>
                    Next Date: {prescription.next_appointment_date}
                  </Text>
                </View>
                <Text style={styles.time}>
                  Pharmacy: {prescription.pharmacy.name}
                </Text>
                <View style={styles.typeRow}>
                  <FontAwesome
                    name="user"
                    size={20}
                    color="#333"
                    style={styles.icon}
                  />
                  <Text style={styles.type}>male</Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.prescriptionButton}
                onPress={() =>
                  navigation.navigate('Prescription Detail', {
                    prescriptionId: prescription.id,
                  })
                }>
                <Text style={styles.prescriptionText}>View Detail</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical:5,
    marginVertical: 10,
    marginHorizontal:10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    borderColor: '#a2a8d3',
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 5, // Spacing between the icon and the input field
  },
  searchInput: {
    flex: 1, // Take remaining space
    fontSize: 16,
    color: '#333',
  },
  header: {
    backgroundColor: '#274A8A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'relative',
    textAlign: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  cardContainer: {
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222831',
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  hospital: {
    marginLeft: 6,
    color: '#666',
  },
  time: {
    color: '#666',
    marginBottom: 4,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  type: {
    marginLeft: 6,
    color: '#4CAF50',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  prescriptionButton: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginRight: 8,
    alignItems: 'center',
  },
  prescriptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PrescriptionHistoryScreen;
