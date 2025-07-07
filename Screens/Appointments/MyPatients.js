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
              <Image
                source={require('../../assets/images/avator.png')}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{appointment.first_name}</Text>
                <View style={styles.hospitalRow}>
                  <FontAwesome
                    name="calendar-o"
                    size={20}
                    color="green"
                    style={styles.icon}
                  />
                  <Text style={styles.hospital}>{appointment.date}</Text>
                </View>
                <View style={styles.typeRow}>
                  <FontAwesome
                    name="clock-o"
                    size={20}
                    color="#333"
                    style={styles.icon}
                  />
                  <Text style={styles.time}>{appointment.time}</Text>
                </View>

                <View style={styles.typeRow}>
                  <FontAwesome
                    name="location-arrow"
                    size={20}
                    color="#333"
                    style={styles.icon}
                  />
                  {appointment.types == 2 ? (
                    <Text style={styles.type}>Video Consultation</Text>
                  ) : (
                    <Text style={styles.type}>On-site Appointment</Text>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              {appointment.status == 1 && (
                <TouchableOpacity
                  style={styles.prescriptionButton}
                  onPress={() =>
                    navigation.navigate('Available Medicines', {
                      appointmentId: appointment.id,
                      patientId: appointment.patient_id,
                      patientName: appointment.first_name,
                    })
                  }>
                  <Text style={styles.prescriptionText}>
                    Write A Prescription
                  </Text>
                </TouchableOpacity>
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
  },
  type: {
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  prescriptionButton: {
    flex: 1,
    backgroundColor: '#274A8A',
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
    backgroundColor: '#25D366',
    color: '#222831',

    borderRadius: 5,

    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8,
  },
});

export default MyPatients;
