
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
import { FontFamily, Color, Padding, Border, FontSize } from '../../GlobalStyles';
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
        source={prescription.patient?.image_url ? 
          { uri: prescription.patient.image_url } : 
          require('../../assets/images/avator.png')} 
        style={styles.image} 
      />
      <View style={styles.info}>
        <Text style={styles.name}>{prescription.patient?.name || 'Unknown Patient'}</Text>
        
        <View style={styles.detailRow}>
          <FontAwesome name="calendar" size={16} color="#4CAF50" style={styles.icon} />
          <Text style={styles.detailText}>Date: {prescription.date || 'N/A'}</Text>
        </View>
      
        <View style={styles.detailRow}>
          <FontAwesome name="calendar-check-o" size={16} color="#FF5252" style={styles.icon} />
          <Text style={styles.detailText}>Next Visit: {prescription.next_appointment_date || 'Not scheduled'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <FontAwesome name="medkit" size={16} color="#2196F3" style={styles.icon} />
          <Text style={styles.detailText}>Pharmacy: {prescription.pharmacy?.name || 'Not specified'}</Text>
        </View>
        
       
      </View>
    </View>
    
    <TouchableOpacity 
      style={styles.viewButton}
      onPress={() => navigation.navigate('Prescription Detail', { prescriptionId: prescription.id })}
      activeOpacity={0.8}
    >
      <Text style={styles.viewButtonText}>View Full Prescription</Text>
     
    </TouchableOpacity>
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
    padding:10,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginTop:6
  },
  card: {
    flexDirection: 'row',
  
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  
  },
  detailText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
  },
  viewButton: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 6,
    margin:4,
    alignSelf: 'flex-end',
    backgroundColor: Color.blue1,
   
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
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
