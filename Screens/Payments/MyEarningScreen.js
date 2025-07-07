import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// Get screen dimensions
const {width} = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseUrl} from '../../Utils/BaseApi';
import axios from 'axios';
// Example images from assets
import Ionicons from 'react-native-vector-icons/Ionicons';

const MyEarningScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWalletBalance();
    fetchDoctorAppointment();
  }, []);
  const fetchWalletBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/wallet-balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //const balanceData = await response.json();
      setWalletBalance(parseFloat(response.data.balance).toFixed(2));

      console.log('Wallet Balance:', response.data.balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };
  const fetchDoctorAppointment = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `${BaseUrl}/get-appointments-by-doctorId`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Appointment Response:', response.data.appointments);
      setAppointment(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointment:', error);
    }
  };

  useEffect(() => {
    // Filter appointments based on search query
    const filtered = appointment.filter(appointment =>
      (appointment.first_name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

    setFilteredAppointments(filtered);
  }, [searchQuery]); // Update when searchQuery changes
  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Earnings</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.wallet}>
          <Text style={styles.walletText}>Wallet Balance:</Text>
          <Text style={styles.walletText}> {walletBalance}</Text>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search here"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery} // Update search query
        />
        {(filteredAppointments.length > 0
          ? filteredAppointments
          : appointment
        ).map(appointment => (
          <View key={appointment.id} style={styles.cardContainer}>
            <View style={styles.card}>
              <Image
                source={require('../../assets/images/avator.png')}
                style={styles.doctorImage}
              />
              <View style={styles.details}>
                <Text style={styles.doctorName}>
                  Patient:{appointment.first_name} ({appointment.id})
                </Text>

                <Text style={styles.time}>
                  Appointment Date: {appointment.date}{' '}
                </Text>
                <Text style={styles.time}> {appointment.type} </Text>
                <Text style={styles.time}>
                  {' '}
                  Checkup Fee: {appointment.checkup_fee}{' '}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Actions below the card */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.meetButton, styles.button]}
          onPress={() => navigation.navigate('Withdraw')}>
          <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:15,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    color:"#000",
    marginLeft:15,
  },
  wallet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 15,
    backgroundColor: '#274A8A',
    width: '100%',
    border: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },
  walletText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 10,
    alignItems: 'center',
    textAlign: 'center',
  },

  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
    color: '#222831',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#222831',
  },
  hospital: {
    fontSize: 14,
    color: '#888',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  videoConsultation: {
    fontSize: 14,
    color: 'green',
  },
  onSiteAppointment: {
    fontSize: 14,
    color: 'blue',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom:10,
    justifyContent: 'space-between', // Add this for equal spacing
  },
  button: {
    flex: 1, // This makes the button take equal width
    height: 40, // Set a fixed height
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
    borderRadius: 5,
    marginHorizontal: 5, // Add horizontal margin for spacing
  },
  confirmButton: {
    backgroundColor: '#347474',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#e46161',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  meetButton: {
    backgroundColor: '#274A8A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default MyEarningScreen;
