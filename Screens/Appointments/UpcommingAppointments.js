import React, {useState, useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, TextInput, Alert, Linking  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseUrl } from '../../Utils/BaseApi';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// Get screen dimensions
const { width } = Dimensions.get('window');
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

const UpcommingAppointments = ({navigation}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);
   
    const [newDate, setNewDate] = useState(new Date());
    const [filterDate, setFilterDate] = useState(null);
const [isFilterDatePickerVisible, setIsFilterDatePickerVisible] = useState(false);
useEffect(() => {
  const filtered = appointments.filter(appointment => {
    // Search filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      appointment.user?.name?.toLowerCase().includes(query) ||
      appointment.date.toLowerCase().includes(query) ||
      appointment.time.toLowerCase().includes(query)
    );

    // Date filter
    let matchesDate = true;
    if (filterDate) {
      const formattedFilterDate = moment(filterDate).format('YYYY-MM-DD');
      matchesDate = appointment.date === formattedFilterDate;
    }

    return matchesSearch && matchesDate;
  });
  setFilteredAppointments(filtered);
}, [searchQuery, appointments, filterDate]);
    const getUpcommingAppointments = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${BaseUrl}/get-upcoming-appointments-bydoctor`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAppointments(response.data);
            console.log('UpcommingAppointments:', response.data);
        } catch (error) {
            console.error('Error fetching appointment:', error);
        }
    };
       useEffect(() => {
        getUpcommingAppointments();
    }, []);
    const getStatusStyle = (status) => {
      return parseInt(status) === 1 ? styles.confirmedStatus : styles.pendingStatus;
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
            appointment.time.toLowerCase().includes(query)
        );
    });
    setFilteredAppointments(filtered);
}, [searchQuery, appointments]); // Add appointments to dependencies
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Upcoming Appointments</Text>
        </View>

        <ScrollView style={styles.container}>
          {/* Back to Home Button */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={24}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search upcoming appointments"
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
{/* Date Filter */}
<View style={styles.dateFilterContainer}>
  <TouchableOpacity 
    style={styles.dateFilterButton}
    onPress={() => setIsFilterDatePickerVisible(true)}
  >
    <Ionicons name="calendar-outline" size={20} color="#274A8A" />
    <Text style={styles.dateFilterText}>
      {filterDate ? moment(filterDate).format('MMM D, YYYY') : 'Filter by Date'}
    </Text>
  </TouchableOpacity>
  {filterDate && (
    <TouchableOpacity 
      style={styles.clearDateFilterButton}
      onPress={() => setFilterDate(null)}
    >
      <Text style={styles.clearDateFilterText}>Clear</Text>
    </TouchableOpacity>
  )}
</View>

<DateTimePickerModal
  isVisible={isFilterDatePickerVisible}
  mode="date"
  onConfirm={(date) => {
    setFilterDate(date);
    setIsFilterDatePickerVisible(false);
  }}
  onCancel={() => setIsFilterDatePickerVisible(false)}
/>
          {/* Conditional rendering */}
         {filteredAppointments.length === 0 ? (
        <Text style={styles.noAppointmentsText}>
          {searchQuery ? 'No results found' : 'No upcoming appointments'}
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
                      <Ionicons
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
                      <Ionicons
                        name="call-outline"
                        size={18}
                        color="#888"
                        style={styles.icon}
                      />
                      <Text
                        style={
                          appointment.type === 1
                            ? styles.videoConsultation
                            : styles.onSiteAppointment
                        }>
                        {appointment.type === 1
                          ? 'Video Consultation'
                          : 'On-site Appointment'}
                      </Text>
                    </View> */}

                    {/* Status */}
                    <View style={styles.infoRow}>
                      <Ionicons
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
                <View style={styles.actions}></View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        elevation: 2,
    },
    headerText: {
        flex: 1,
        textAlign: 'left',
        fontSize: 18,
        fontWeight: 'bold',
        color:"#000",
marginLeft:10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f6f78',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignSelf: 'flex-start',
      },
      backButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontSize: 16,
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
    },
    searchInput: {
        flex: 1, // Take remaining space
        fontSize: 16,
        color: '#333',
    },
    dateFilterContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: 5,
  marginTop: 10,
  gap: 10,
},
dateFilterButton: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  backgroundColor: '#f0f0f0',

  borderRadius: 10,
  borderWidth:1,
  borderColor:'#274A8A',
  flex: 1,

},
dateFilterText: {
  marginLeft: 8,
  color: '#274A8A',
},
clearDateFilterButton: {
  padding: 10,
  backgroundColor: '#ff4444',
  borderRadius: 10,
},
clearDateFilterText: {
  color: 'white',
},
    noAppointmentsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginVertical: 20, // Add space around the message
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
        backgroundColor: '#347474',
    },
    cancelButton: {
        backgroundColor: '#e46161',
    },
    meetButton: {
        backgroundColor: '#274A8A',
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
        color: 'pink',
        fontWeight: 'bold',
    },
  

});
export default UpcommingAppointments;