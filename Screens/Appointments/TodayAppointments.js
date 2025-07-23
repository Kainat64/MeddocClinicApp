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
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseUrl} from '../../Utils/BaseApi';
import axios from 'axios';
import { RefreshControl } from 'react-native';

// Get screen dimensions
const {width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import FilterModal from './FilterModal';
import { ActivityIndicator } from 'react-native';
import { Color } from '../../GlobalStyles';
const TodayAppointments = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState(new Date());
   const [filterDate, setFilterDate] = useState(null);
      const [filterStatus, setFilterStatus] = useState(null); // 1: Confirmed, 0: Pending
  const [filterType, setFilterType] = useState(null);     // 1: On-site, 2: Video, 3: Voice
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [imageErrorIds, setImageErrorIds] = useState([]);
const handleImageError = (id) => {
    setImageErrorIds((prev) => [...prev, id]);
};

  const handleClearFilters = () => {
    setFilterStatus(null);
    setFilterType(null);
    setFilterDate(null);
  };
  useEffect(() => {
    const filtered = appointments.filter(appointment => {
      const query = searchQuery.toLowerCase();
  
      const userName = appointment?.user?.name
        ? appointment.user.name.toLowerCase()
        : '';
  
      const date = appointment?.date ? appointment.date.toLowerCase() : '';
  
      // Only convert to lowercase if time exists
      const time = appointment?.time ? appointment.time.toLowerCase() : '';
  
     const matchesSearch =
    userName.includes(query) ||
    date.includes(query) ||
    (appointment.time && time.includes(query));
  
      let matchesDate = true;
      if (filterDate) {
        const formattedFilterDate = moment(filterDate).format('YYYY-MM-DD');
        matchesDate = appointment.date === formattedFilterDate;
      }
  
      let matchesStatus = true;
      if (filterStatus !== null) {
        matchesStatus = parseInt(appointment.status) === filterStatus;
      }
  
      let matchesType = true;
      if (filterType !== null) {
        matchesType = parseInt(appointment.types) === filterType;
      }
  
      return matchesSearch && matchesDate && matchesStatus && matchesType;
    });
  
    setFilteredAppointments(filtered);
  }, [searchQuery, appointments, filterDate, filterStatus, filterType]);
  
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
    const unsubscribe = navigation.addListener('focus', () => {
        getTodayAppointments();
    });
    return unsubscribe;
}, [navigation]);

const getTodayAppointments = async () => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(
      `${BaseUrl}/get-today-appointments-bydoctor`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    setAppointments(response.data);
  } catch (error) {
    console.error('Error fetching appointment:', error);
  } finally {
    setLoading(false);
  }
};

  const getStatusStyle = status => {
    return parseInt(status) === 1
      ? styles.confirmedStatus
      : styles.pendingStatus;
  };

const getTypeStatus = types => {
  const type = parseInt(types);
  if (type === 1) return styles.onSiteAppointment;
  if (type === 2) return styles.videoConsultation;
  return styles.voiceConsultation; // For type 3 or any other fallback
};useEffect(() => {
    // Filter appointments based on search query across multiple fields
    const filtered = appointments.filter(appointment => {
        const query = searchQuery.toLowerCase();
        return (
            appointment.user?.name?.toLowerCase().includes(query) ||
            appointment.date.toLowerCase().includes(query) ||
            (appointment.time && appointment.time.toLowerCase().includes(query)) 
        );
    });
    setFilteredAppointments(filtered);
}, [searchQuery, appointments]); // Add appointments to dependencies
  
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

  const handleConfirmAppointment = async appointment => {
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
 await getTodayAppointments();
        // console.log('Appointment Type:', appointment.types);

        if (parseInt(appointment.types) === 2) {
          console.log('Creating Zoom meeting for video consultation...');
          await saveZoomMeeting(appointment);
          await getTodayAppointments();
        }
        if (parseInt(appointment.types) === 3) {
          console.log('Creating Zoom meeting for Voice consultation...');
          await saveVoiceZoomMeeting(appointment);
        await getTodayAppointments();

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
  };

  const saveZoomMeeting = async appointment => {
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
  };

  const saveVoiceZoomMeeting = async appointment => {
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
  };

  const openMeetingLink = async appointment => {
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
  };

 const handleRescheduleAppointment = useCallback(async (newDateObj) => {
  if (!selectedAppointment || !selectedAppointment.id) {
    console.warn('Selected appointment is null or missing ID');
    Alert.alert('Error', 'No appointment selected for rescheduling.');
    return;
  }
  try {
    const token = await AsyncStorage.getItem('userToken');
    const formattedNewDate = moment(newDateObj).format('YYYY-MM-DD');
    const response = await axios.post(
      `${BaseUrl}/update-appointment-date`,
      {
        appointment_id: selectedAppointment.id,
        new_date: formattedNewDate,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      Alert.alert('Success', 'Appointment rescheduled successfully!');
      setSelectedAppointment(null);  // 👈 Reset
      setNewDate(new Date());        // 👈 Reset
      getTodayAppointments();
    } else {
      Alert.alert('Error', 'Failed to reschedule appointment.');
    }
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    Alert.alert('Error', 'An error occurred while rescheduling the appointment.');
  }
}, [selectedAppointment]);


  const showDatePicker = appointment => {
    setSelectedAppointment(appointment);
    setIsDatePickerVisible(true);
  };
// const onDateChange = (event, selectedDate) => {
//   if (selectedDate) {
//     setIsDatePickerVisible(false);
//     setNewDate(selectedDate);
//     if (selectedAppointment) {
//       handleRescheduleAppointment(selectedDate);  // Pass Date, not formatted string
//     }
//   }
// };
const onDateChange = (event, selectedDate) => {
  if (selectedDate) {
    const today = moment().startOf('day');
    const pickedDate = moment(selectedDate).startOf('day');

    if (pickedDate.isBefore(today)) {
      Alert.alert('Invalid Date', 'You cannot select a past date for rescheduling.');
      setIsDatePickerVisible(false);
      return;
    }

    setIsDatePickerVisible(false);
    setNewDate(selectedDate);
    if (selectedAppointment) {
      handleRescheduleAppointment(selectedDate);
    }
  }
};

  const handleJoinMeet = meetingId => {
    navigation.navigate('Join Meet', {meetingId});
    
  };
const onRefresh = async () => {
    try {
        setRefreshing(true);
        await getTodayAppointments();
    } finally {
        setRefreshing(false);
    }
};

  return (
    <ScrollView style={styles.container }
     contentContainerStyle={{ paddingBottom: 20 }}
     refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Color.blue1]} />
    }>
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
<View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
  }}
>
  {/* Filters Button (Left) */}
  <TouchableOpacity
    onPress={() => setIsFilterModalVisible(true)}
    style={{
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: Color.blue1,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <Ionicons name="filter-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
    <Text style={{ color: '#fff', fontWeight: '600' }}>Filters</Text>
  </TouchableOpacity>

  {/* Clear Button (Right) */}
  <TouchableOpacity
    onPress={() => {
      setFilterStatus(null);
      setFilterType(null);
      setFilterDate(null);
    }}
    style={{
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: Color.secondary, // light gray
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <Ionicons name="refresh-outline" size={18} color={Color.blue1} style={{ marginRight: 6 }} />
    <Text style={{ color: Color.blue1, fontWeight: '600' }}>Clear</Text>
  </TouchableOpacity>
</View>


<FilterModal
  visible={isFilterModalVisible}
  onClose={() => setIsFilterModalVisible(false)}
  filterStatus={filterStatus}
  setFilterStatus={setFilterStatus}
  filterType={filterType}
  setFilterType={setFilterType}
  filterDate={filterDate}
  setFilterDate={setFilterDate}
  onClearFilters={handleClearFilters}
/>

      {/* Check if there are no appointments */}
{
    loading ? (
        <ActivityIndicator size="large" color={Color.blue1} style={{ marginTop: 50 }} />
    ) : appointments.length === 0 ? (
        <Text style={styles.noAppointmentsText}>No appointments found</Text>
    ) : filteredAppointments.length === 0 ? (
        <Text style={styles.noAppointmentsText}>No results found</Text>
    ) : (
        filteredAppointments.map(appointment => (
            <View key={appointment.id} style={styles.cardContainer}>
                <View style={styles.card}>
                    <View style={styles.row}>
                       <Image
    source={
        appointment.user.image_url && !imageErrorIds.includes(appointment.id)
            ? { uri: appointment.user.image_url }
            : require('../../assets/images/user.png')
    }
    style={styles.doctorImage}
    onError={() => handleImageError(appointment.id)}
/>

                        <View style={styles.details}>
                            <Text style={styles.doctorName}>{appointment.user.name}</Text>

                            {/* Date */}
                            <View style={styles.infoRow}>
                                <Icon name="calendar" size={18} color={Color.blue1} style={styles.icon} />
                                <Text style={styles.hospital}>{appointment.date}</Text>
                            </View>

                            {/* Time */}
                            {Number(appointment.types) !== 1 && (
                                <View style={styles.infoRow}>
                                    <Icon name="time" size={18} color={Color.blue1} style={styles.icon} />
                                    <Text style={styles.time}>
                                        {moment(appointment.time, 'HH:mm').format('hh:mm A')}
                                    </Text>
                                </View>
                            )}

                            {/* Status */}
                           <View style={styles.infoRow}>
    <Ionicons
        name={parseInt(appointment.status) === 1 ? 'checkmark-circle' : 'alert-circle-outline'}
        size={18}
        color={parseInt(appointment.status) === 1 ? 'green' : 'red'}
        style={{ marginRight: 8 }}
    />
    <Text style={getStatusStyle(appointment.status)}>
        {parseInt(appointment.status) === 1 ? 'Confirmed' : 'Pending'}
    </Text>
</View>
                            <View style={styles.infoRow}>
                                <Icon
                                    name={
                                        parseInt(appointment.types) === 1
                                            ? 'location'
                                            : parseInt(appointment.types) === 2
                                            ? 'camera'
                                            : 'call'
                                    }
                                    size={18}
                                    color={
                                        parseInt(appointment.types) === 1
                                            ? Color.blue1
                                            : parseInt(appointment.types) === 2
                                            ? Color.blue1
                                            : Color.blue1
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

                    <View style={styles.actions}>
                        {parseInt(appointment.status) !== 1 && (
                            <TouchableOpacity
                                style={[styles.confirmButton, styles.button]}
                                onPress={() => confirmAppointmentPrompt(appointment)}
                            >
                                <Text style={styles.buttonText}>Confirm</Text>
                            </TouchableOpacity>
                        )}

                        {parseInt(appointment.status) === 0 && (
                            <TouchableOpacity
                                style={[styles.cancelButton, styles.button]}
                                onPress={() => showDatePicker(appointment)}
                            >
                                <Text style={styles.rescheduleText}>Re Schedule</Text>
                            </TouchableOpacity>
                        )}

                        {parseInt(appointment.status) === 1 &&
                            (parseInt(appointment.types) === 2 || parseInt(appointment.types) === 3) && (
                                <TouchableOpacity
                                    style={[styles.meetButton, styles.button]}
                                    onPress={() => handleJoinMeet(appointment.meet.id)}
                                >
                                    <Text style={styles.buttonText}>
                                        {parseInt(appointment.types) === 2 ? 'Join Video Call' : 'Join Voice Call'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                    </View>
                </View>
            </View>
        ))
    )
}



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
    paddingBottom: 50,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
 
},
card: {
    flexDirection: 'column', // changed from 'row'
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
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


  doctorImage: {
    width: "35%",
        height: "100%",
        borderRadius: 8,
        marginRight: 10,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#222831',
  },
  hospital: {
    fontSize: 14,
     color: Color.blue1,
  },
  time: {
    fontSize: 14,
     color: Color.blue1,
  },
  videoConsultation: {
    fontSize: 14,
     color: Color.blue1,
    fontWeight: 'bold',
  
  },
  voiceConsultation:{
     fontSize: 14,
   color: Color.blue1,
    fontWeight:'bold'
  },
  onSiteAppointment: {
    fontSize: 14,
    color: Color.blue1,
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
    
  },
  button: {
    flex: 1,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: Color.blue1,
  },
  cancelButton: {
    backgroundColor: Color.secondary, // light gray
  },
  meetButton: {
    backgroundColor: 'green',
  },
  rescheduleText:{
    color: Color.blue1,
    fontSize: 14,
    fontWeight: '700',
  
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15, // Makes it perfectly round
    backgroundColor: Color.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
},

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
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
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TodayAppointments;
