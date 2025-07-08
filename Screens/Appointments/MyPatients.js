import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseUrl} from '../../Utils/BaseApi';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {color} from 'react-native-elements/dist/helpers';
import { Color } from '../../GlobalStyles';
import moment from 'moment';
const MyPatients = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    fetchDoctorAppointment();
  }, []);
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
      //console.log('Appointment Response:', response.data.appointments);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter(
    appointment =>
      appointment.first_name &&
      appointment.first_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome
          name="search"
          size={18}
          color="#aaa"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView>
        {filteredAppointments.map(appointment => (
         <View key={appointment.id} style={styles.cardContainer}>
  <View style={styles.card}>
    <View style={styles.row}>
      <Image
        source={require('../../assets/images/avator.png')}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{appointment.first_name}</Text>
        <View style={styles.hospitalRow}>
          <FontAwesome name="calendar-o" size={20} color="green" style={styles.icon} />
          <Text style={styles.hospital}>{appointment.date}</Text>
        </View>
       {Number(appointment.types) !== 1 && (
                <View style={styles.hospitalRow}>
                  <FontAwesome name="clock-o" size={20} color={Color.blue1} />
                  <Text style={styles.hospital}>
                      <Text style={styles.time}>{appointment.time}</Text>
                  </Text>
                </View>
              )}
        <View style={styles.hospitalRow}>
                {Number(appointment.types) === 1 ? (
                  <FontAwesome name="building" size={14} color={Color.blue1} />
                ) : Number(appointment.types) === 2 ? (
                  <FontAwesome name="video-camera" size={14} color={Color.blue1} />
                ) : (
                  <FontAwesome name="phone" size={14} color={Color.blue1} />
                )}
                <Text style={styles.hospital}>
                  {Number(appointment.types) === 1 
                    ? "On-site Consultation" 
                    : Number(appointment.types) === 2 
                      ? "Video Consultation" 
                      : "Voice Consultation"}
                </Text>
              </View>
      </View>
    </View>

    {appointment.status == 1 && (
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.prescriptionButton}
          onPress={() =>
            navigation.navigate('Available Medicines', {
              appointmentId: appointment.id,
              patientId: appointment.patient_id,
              patientName: appointment.first_name,
            })
          }>
          <Text style={styles.prescriptionText}>Write A Prescription</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
</View>

        ))}
      </ScrollView>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backText}>Back To Home</Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#222831',
    fontSize: 16,
  },
  cardContainer: {
    marginBottom: 16,
    marginTop:8
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

actions: {
  marginTop: 10,
  alignItems: 'flex-end',
},


  prescriptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
    bottom: 0,
    position: 'fixed',
    height: 40,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: Color.blue1,
    color: '#222831',

    borderRadius: 5,

    alignItems: 'center',
  },
  card: {
  padding: 16,
  borderRadius: 10,
  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 2,
  flexDirection: 'column', // vertical layout
  justifyContent: 'space-between',
},

row: {
  flexDirection: 'row',
  marginBottom: 12,
},

buttonRow: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
},

prescriptionButton: {
  backgroundColor: Color.blue1,
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 5,
},

  backText: {
    color: '#fff',
    fontWeight: 'bold',
  },

});

export default MyPatients;
