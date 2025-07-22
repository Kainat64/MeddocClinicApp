
import React, {useState, useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, TextInput, Alert, Linking, ActivityIndicator  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseUrl } from '../../Utils/BaseApi';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// Get screen dimensions
const { width } = Dimensions.get('window');
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import FilterModal from './FilterModal';
import { RefreshControl } from 'react-native';
import { Color } from '../../GlobalStyles';
const UpcommingAppointments = ({navigation}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);
   
    const [newDate, setNewDate] = useState(new Date());
    const [filterDate, setFilterDate] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null); // 1: Confirmed, 0: Pending
const [filterType, setFilterType] = useState(null);     // 1: On-site, 2: Video, 3: Voice
const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);

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


    const getUpcommingAppointments = async () => {
        try {
          setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${BaseUrl}/get-upcoming-appointments-bydoctor`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAppointments(response.data);
            // console.log('UpcommingAppointments:', response.data);
        } catch (error) {
            console.error('Error fetching appointment:', error);
        }
        finally {
    setLoading(false);
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
};
const onRefresh = async () => {
    try {
        setRefreshing(true);

        // Clear search and filters
        setSearchQuery('');
        setFilterDate(null);
        setFilterStatus(null);
        setFilterType(null);

        await getUpcommingAppointments();
    } finally {
        setRefreshing(false);
    }
};


    return (
      <ScrollView style={{flex: 1}}  refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Color.blue1]} />
    }>
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



          {/* Conditional rendering */}

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
                        name="calendar"
                        size={18}
                        color={Color.blue1}
                        style={styles.icon}
                      />
                      <Text style={styles.hospital}>{appointment.date}</Text>
                    </View>

                    {/* Time */}
                    {Number(appointment.types) !== 1 && (
                                   <View style={styles.infoRow}>
                                     <Icon
                                       name="time"
                                       size={18}
                                       color={Color.blue1}
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
        name={parseInt(appointment.status) === 1 ? 'checkmark-circle-outline' : 'alert-circle-outline'}
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

                {/* Actions below the card */}
                <View style={styles.actions}></View>
              </View>
            ))
          )}
        </ScrollView>
      </ScrollView>
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
        width: "35%",
        height: "100%",
        borderRadius: 8,
        marginRight: 20,
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
        backgroundColor: 'red',
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
        color: 'red',
        fontWeight: 'bold',
    },
    filterSection: {
  paddingHorizontal: 15,
  marginTop: 10,
  marginBottom: 10,
},
filterHeading: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 5,
  color: '#333',
},
filterRow: {
  flexDirection: 'row',
  marginBottom: 10,
  flexWrap: 'wrap',
},
filterButton: {
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderWidth: 1,
  borderColor: '#999',
  borderRadius: 20,
  marginRight: 10,
  marginBottom: 8,
},
filterButtonActive: {
  backgroundColor: '#274A8A',
  borderColor: '#274A8A',
},
filterText: {
  color: '#333',
  fontSize: 14,
},

  

});
export default UpcommingAppointments;