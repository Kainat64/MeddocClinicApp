import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseUrl} from '../../Utils/BaseApi';
import axios from 'axios';
// Get screen dimensions
const {width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
const TodayAppointments = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState(new Date());
   const [isLoading, setIsLoading] = useState(true); // Added loading state
  const getStatusColor = status => {
    switch (status) {
      case 1:
        return 'green';
      case 2:
        return 'orange';
      case 3:
        return 'red';
      default:
        return 'pink';
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      getTodayAppointments();
    }, 5000); // 5000 ms = 5 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

 const getTodayAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `${BaseUrl}/get-today-appointments-bydoctor`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const getStatusStyle = useCallback((status)  => {
    return parseInt(status) === 1
      ? styles.confirmedStatus
      : styles.pendingStatus;
  }, [])

const getTypeStatus = useCallback((types) => {
  const type = parseInt(types);
  if (type === 1) return styles.onSiteAppointment;
  if (type === 2) return styles.videoConsultation;
  return styles.voiceConsultation; // For type 3 or any other fallback
}, [])

  useEffect(() => {
const filtered = appointments.filter(appointment =>
  appointment.hospital?.hospital_name?.toLowerCase().includes(searchQuery.toLowerCase())


    );
    setFilteredAppointments(filtered);
  }, [appointments, searchQuery]); // Update when searchQuery changes
  const confirmAppointmentPrompt = appointment => {
    Alert.alert(
      'Confirm Appointment',
      'Are you sure you want to confirm the appointment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => handleConfirmAppointment(appointment),
        },
      ],
      {cancelable: false},
    );
  };

  const handleConfirmAppointment =useCallback( async (appointment) => {
    console.log('Starting appointment confirmation:', appointment);
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Fetched token:', token);

      const response = await axios.post(
        `${BaseUrl}/update-appointment-status`,
        {
          appointment_id: appointment.id,
          status: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      //console.log('Appointment confirmation response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Appointment confirmed successfully!');

        console.log('Appointment Type:', appointment.types);

        if (parseInt(appointment.types) === 2) {
          console.log('Creating Zoom meeting for video consultation...');
          await saveZoomMeeting(appointment);
          getTodayAppointments(); // Refresh appointments
        }
        if (parseInt(appointment.types) === 3) {
          console.log('Creating Zoom meeting for Voice consultation...');
          await saveVoiceZoomMeeting(appointment);
          getTodayAppointments(); // Refresh appointments
        }
      } else {
        console.warn('API responded with failure:', response.data);
        Alert.alert('Error', 'Failed to confirm appointment.');
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
      Alert.alert(
        'Error',
        'An error occurred while confirming the appointment.',
      );
    }
    }, []);

  const saveZoomMeeting = useCallback(async (appointment) => {
    try {
      console.log('saveZoomMeeting called for:', appointment);

      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${BaseUrl}/zoom/save-meeting`,
        {
          user_id: appointment.patient_id,
          appointment_id: appointment.id,
          topic: 'Video Consultation',
          start_time: appointment.date + ' ' + appointment.time,
          duration: 30,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Zoom API response:', response.data);

      if (response.status === 200) {
        Alert.alert('Success', 'Zoom meeting created successfully!');
      } else {
        Alert.alert('Error', 'Failed to create Zoom meeting.');
      }
    } catch (error) {
      console.error(
        'Error creating Zoom meeting:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        'An error occurred while creating the Zoom meeting.',
      );
    }
    }, []);

  const saveVoiceZoomMeeting = useCallback(async (appointment) => {
    try {
      console.log('saveZoomMeeting called for:', appointment);

      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${BaseUrl}/zoom/save-voice-call`,
        {
          user_id: appointment.patient_id,
          appointment_id: appointment.id,
          topic: 'Voice Consultation',
          start_time: appointment.date + ' ' + appointment.time,
          duration: 30,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Zoom API response:', response.data);

      if (response.status === 200) {
        Alert.alert('Success', 'Zoom meeting created successfully!');
      } else {
        Alert.alert('Error', 'Failed to create Zoom meeting.');
      }
    } catch (error) {
      console.error(
        'Error creating Zoom meeting:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        'An error occurred while creating the Zoom meeting.',
      );
    }
  },[]);


  const openMeetingLink =useCallback(async (appointment) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${BaseUrl}/zoom/get-meeting-link`,
        {
          user_id: appointment.patient_id,
          appointment_id: appointment.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const meetingLink = response.data.meeting;
        console.log('Meeting URL:', meetingLink);

        // Directly using the browser URL format
        const browserMeetingLink = `https://zoom.us/wc/join/${meetingLink}?prefer=1`;

        // Force open in browser
        Linking.openURL(browserMeetingLink);
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to get meeting link.',
        );
      }
    } catch (error) {
      console.error('Error fetching meeting link:', error);
      Alert.alert(
        'Error',
        'An error occurred while fetching the meeting link.',
      );
    }
  },[]);


  const handleRescheduleAppointment = useCallback(async (newDate) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const formattedNewDate = moment(newDate).format('YYYY-MM-DD');

      const response = await axios.post(
        `${BaseUrl}/update-appointment-date`,
        {
          appointment_id: selectedAppointment.id,
          new_date: formattedNewDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(newDate);

      if (response.data.success) {
        Alert.alert('Success', 'Appointment rescheduled successfully!');
        getTodayAppointments(); // Fetch updated appointments
      } else {
        Alert.alert('Error', 'Failed to reschedule appointment.');
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      Alert.alert(
        'Error',
        'An error occurred while rescheduling the appointment.',
      );
    }
  }, [])

  const showDatePicker = appointment => {
    setSelectedAppointment(appointment);
    setIsDatePickerVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD'); // Format the selected date
      setIsDatePickerVisible(false); // Hide date picker
      setNewDate(formattedDate); // Update the newDate state

      if (selectedAppointment) {
        handleRescheduleAppointment(formattedDate); // Pass the formatted new date
      }
    }
  };
  const handleJoinMeet = meetingId => {
    navigation.navigate('Join Meet', {meetingId});
    
  };
  useEffect(() => {
    // Filter appointments based on search query across multiple fields
    const filtered = appointments.filter(appointment => {
        const query = searchQuery.toLowerCase();
        return (
            appointment.user?.name?.toLowerCase().includes(query) ||
            appointment.date.toLowerCase().includes(query) ||
            appointment.time.toLowerCase().includes(query)
        );
    });
    setFilteredAppointments(filtered);
}, [searchQuery, appointments]); // Add appointments to dependencies
const renderAppointmentCard = useCallback((appointment) => (
    <View key={appointment.id} style={styles.cardContainer}>
      {/* Card content - same as before */}
    </View>
  ), []);
 const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#274A8A" />
        </View>
      );
    }

    if (filteredAppointments.length === 0) {
      return (
        <Text style={styles.noAppointmentsText}>
          {searchQuery ? 'No results found' : 'No Appointments Today'}
        </Text>
      );
    }

    return filteredAppointments.map(renderAppointmentCard);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.backButton}>
          <FontAwesome name="chevron-left" size={20} color="#666" />
        </TouchableOpacity>
        <Ionicons
          name="search"
          size={24}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search pending appointments"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Check if there are no appointments */}
       {filteredAppointments.length === 0 ? (
        <Text style={styles.noAppointmentsText}>
          {searchQuery ? 'No results found' : 'Loading....'}
        </Text>
      ) : (
        filteredAppointments.map(appointment => (
          <View key={appointment.id} style={styles.cardContainer}>
            <View style={styles.card}>
            <Image
  source={
    appointment.user.image_url 
      ? { uri: appointment.user.image_url }
      : require('../../assets/images/avator.png')
  }
  style={styles.doctorImage}
  onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
/>
              <View style={styles.details}>
                <Text style={styles.doctorName}>
                  {appointment.user.name}
                </Text>

                {/* Date */}
                <View style={styles.infoRow}>
                  <Icon
                    name="calendar-outline"
                    size={18}
                    color="#888"
                    style={styles.icon}
                  />
                  <Text style={styles.hospital}>{appointment.date}</Text>
                </View>

                {/* Time */}
                {Number(appointment.types) !== 1 && (
                <View style={styles.infoRow}>
                  <Icon
                    name="time-outline"
                    size={18}
                    color="#888"
                    style={styles.icon}
                  />
                  <Text style={styles.time}>
                    {moment(appointment.time, 'HH:mm').format('hh:mm A')}
                  </Text>
                </View>
                )}
                {/* Type */}
             {/* <View style={styles.infoRow}>
              <Icon
                name="call-outline"
                size={18}
                color="#888"
                style={styles.icon}
              />
              <Text
                style={
                  parseInt(appointment.types) === 2
                    ? styles.videoConsultation
                    : parseInt(appointment.types) === 3
                    ? styles.voiceConsultation
                    : styles.onSiteAppointment
                }
              >
                {parseInt(appointment.types) === 2
                  ? 'Video Consultation'
                  : parseInt(appointment.types) === 3
                  ? 'Voice Consultation'
                  : 'On-site Appointment'}
              </Text>
            </View> */}

                {/* Status */}
                <View style={styles.infoRow}>
                  <Icon
                    name="alert-circle-outline"
                    size={18}
                    color={
                      parseInt(appointment.status) === 1 ? 'green' : 'red'
                    }
                    style={{marginRight: 8}}
                  />

                  <Text style={getStatusStyle(appointment.status)}>
                    {parseInt(appointment.status) === 1
                      ? 'Confirmed'
                      : 'Pending'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
              <Icon
                name={
                  parseInt(appointment.types) === 1
                    ? 'location-outline'
                    : parseInt(appointment.types) === 2
                    ? 'camera-outline'
                    : 'call-outline'
                }
                size={18}
                color={
                  parseInt(appointment.types) === 1
                    ? 'green'
                    : parseInt(appointment.types) === 2
                    ? '#5FC3E4'
                    : 'orange'
                }
                style={styles.icon}
              />
              <Text style={getTypeStatus(appointment.types)}>
                {parseInt(appointment.types) === 1
                  ? 'On Site Appointment'
                  : parseInt(appointment.types) === 2
                  ? 'Video Consultation'
                  : 'Voice Consultation'}
              </Text>
            </View>
          </View>
              </View>
           

            {/* Actions below the card */}
            <View style={styles.actions}>
              {parseInt(appointment.status) !== 1 && (
                <TouchableOpacity
                  style={[styles.confirmButton, styles.button]}
                  onPress={() => confirmAppointmentPrompt(appointment)}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              )}
              {parseInt(appointment.status) === 0 && (
                <TouchableOpacity
                  style={[styles.cancelButton, styles.button]}
                  onPress={() => showDatePicker(appointment)}>
                  <Text style={styles.buttonText}>Re Schedule</Text>
                </TouchableOpacity>
              )}

              {parseInt(appointment.status) === 1 &&
                (parseInt(appointment.types) === 2 ||
                  parseInt(appointment.types) === 3) && (
                  <TouchableOpacity
                    style={[styles.meetButton, styles.button]}
                    onPress={() => handleJoinMeet(appointment.meet.id)}>
                    <Text style={styles.buttonText}>
                      {parseInt(appointment.types) === 2
                        ? 'Join Video Call'
                        : 'Join Voice Call'}
                    </Text>
                  
                  </TouchableOpacity>
                )}
            </View>
          </View>
        ))
      )}
  {renderContent()}
      {isDatePickerVisible && (
        <DateTimePicker
          value={newDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 5, // Spacing between the icon and the input field
    marginLeft:10,
  },
  searchInput: {
    flex: 1, // Take remaining space
    fontSize: 16,
    color: '#333',
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
    color: '#5FC3E4',
    fontWeight: 'bold',
  
  },
  voiceConsultation:{
     fontSize: 14,
    color: 'orange',
    fontWeight:'bold'
  },
  onSiteAppointment: {
    fontSize: 14,
    color: 'green',
    fontWeight:'bold'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  icon: {
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    marginBottom:15
  },
  button: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#274A8A',
  },
  cancelButton: {
    backgroundColor: '#e46161',
  },
  meetButton: {
    backgroundColor: '#25D366',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  confirmedStatus: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
  },
  pendingStatus: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },

  noAppointmentsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noAppointmentsText: {
    fontSize: 16,
    color: '#888',
  },
});

export default TodayAppointments;
