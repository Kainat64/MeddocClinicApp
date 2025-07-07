import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Button,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {width} = Dimensions.get('window');
import {useAuth} from '../Components/AuthContext';
import {BaseUrl} from '../Utils/BaseApi';
import axios from 'axios';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardScreen from './DashboardScreen';
const Tab = createBottomTabNavigator();
import TodayAppointments from './Appointments/TodayAppointments';
import UpcommingAppointments from './Appointments/UpcommingAppointments';
import MyPatients from './Appointments/MyPatients';
import ProfileScreen from './ProfileScreen';
import GetLocation from 'react-native-get-location';
const Drawer = createDrawerNavigator();
import {getHospitalsProfile} from '../Utils/api';
import { Modal } from 'react-native';
import { FontFamily, Color, Padding, Border, FontSize } from '../GlobalStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { debounce } from 'lodash';
import { getSetting } from '../Utils/SettingsService';
const HomeScreen = ({navigation}) => {
    const colors = {
    primary: '#5f5dbd',
    primaryLight: '#e8e8fa',
    white: '#ffffff',
    gray: '#f8fafc',
    darkGray: '#6b7280',
    lightGray: '#e5e7eb',
    red: '#ef4444',
    green: '#10b981',
    yellow: '#f59e0b',
  };
 const services = [
    { icon: 'heartbeat', name: 'Heart Checkup', description: 'Cardiac assessment' },
    { icon: 'brain', name: 'Mental Health', description: 'Therapy services' },
    { icon: 'baby', name: 'Pediatrics', description: 'Child healthcare' },
    { icon: 'tooth', name: 'Dental Care', description: 'Oral health' },
  ];


  const {logout, user} = useAuth();
  const [doctor, setDoctor] = useState({});
  const [walletBalance, setWalletBalance] = useState(0);
  const [withdrawBalance, setWithdrawBalance] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [upcommingAppointments, setUpcommingAppointments] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [countPatients, setCountPatients] = useState(0);
  const [blog, setBlog] = useState([]);
  const [cityName, setCityName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hospital, setHospital] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  // Unified data fetching with error handling
    const metrics = [
  { icon: 'calendar', name: 'Today Appointments', value: todayAppointments, screen: 'Today Appointments' },
  { icon: 'wallet', name: 'My Earnings', value: `$${walletBalance}`, screen: 'My Earning' },
  { icon: 'clock', name: 'Upcoming', value: upcommingAppointments, screen: 'Upcomming Appointments' },
  { icon: 'users', name: 'My Patients', value: countPatients, screen: 'My Patients' },
];
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await Promise.all([
        fetchDoctor(),
        countAppointments(),
        // fetchWalletBalance(),
        fetchBlog(),
      ]);
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        await getCurrentLocation();
      }
    } catch (err) {
      setError(err.message);
      console.error('Dashboard loading error:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
const handleBellClick = () => setShowNotifications(true);

  const handleNotificationClose = () => {
    setShowNotifications(false);
    markNotificationsAsRead();
  };
 const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/get-user-notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  const markNotificationsAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        `${BaseUrl}/mark-read-user-notifications`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  // const fetchWalletBalance = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('userToken');
  //     const response = await axios.get(`${BaseUrl}/wallet-balance`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setWalletBalance(response.data.balance);
  //     setWithdrawBalance(response.data.withdrawable);
  //   } catch (error) {
  //     console.error('Error fetching wallet balance:', error);
  //     throw error;
  //   }
  // };

  const countAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `${BaseUrl}/count-appointments-by-doctorId`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTodayAppointments(response.data.todayAppointments);
      setUpcommingAppointments(response.data.upcomingAppointments);
      setTotalAppointments(response.data.totalAppointments);
      setCountPatients(response.data.countPatient);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  };

  const fetchBlog = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/blog-posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  };

  const fetchDoctor = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      let endpoint = '';
      
      if (user?.type === 'doctor') {
        endpoint = '/get-doctor-app-profile';
      } else if (user?.type === 'hospital') {
        endpoint = '/get-hospitals-profile';
      } else {
        console.warn('Unknown user type:', user?.type);
        return; // Exit early for unknown types
      }
  
      const response = await axios.get(`${BaseUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Set data based on user type
      if (user?.type === 'doctor') {
        setDoctor(response.data); // Directly use response data for doctors
      } else if (user?.type === 'hospital') {
        setDoctor(response.data[0]); // Use first array element for hospitals
      }
  
      console.log('API response for doctor/hospital profile:', response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  };
  const getAvatarUrl = (name, size = 60) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5f5dbd&color=ffffff&size=${size}`;

  const getCurrentLocation = async () => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      const {latitude, longitude} = location;
      getCityNameFromCoords(latitude, longitude);
    } catch (error) {
      console.warn('Location error:', error);
      setCityName('Location unavailable');
      throw error;
    }
  };

const googleMapsApiKey = Platform.OS === 'android'
  ? getSetting('android_sdk_api_key')
  : getSetting('ios_sdk_api_key');
  const getCityNameFromCoords = async (latitude, longitude) => {
const API_KEY = googleMapsApiKey;

 console.log(" API key",API_KEY )
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Google Maps API response", data);
      if (data.results.length > 0) {
        const cityName = data.results[0].address_components.find(component =>
          component.types.includes('locality'),
        ).long_name;
        setCityName(cityName);
         console.log("give me city name", cityName)
      } else {
        setCityName('City not found');
      }
     
    } catch (error) {
      console.error('Error in reverse geocoding: ', error);
    }
  };
  

  const MemoizedBlogItem = React.memo(({item}) => (
    <View style={styles.eventCardContainer}>
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => navigation.navigate('Blog Details', {blog: item})}>
        <Image
          source={{uri: item.image_url || 'https://via.placeholder.com/150'}}
          style={styles.eventImage}
        />
        <Text style={styles.eventTitle}>
          {item.title.length > 30
            ? `${item.title.substring(0, 30)}...`
            : item.title}
        </Text>
      </TouchableOpacity>
    </View>
  ));
  const NotificationModal = () => (
    <Modal
      visible={showNotifications}
      transparent={true}
      animationType="fade"
      onRequestClose={handleNotificationClose}>
      <View style={styles.modalBackground}>
        <View style={styles.notificationModal}>
          <TouchableOpacity style={styles.closedButton} onPress={handleNotificationClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.notifyText}>Notifications</Text>

          <ScrollView contentContainerStyle={styles.notificationList}>
            {notifications.length > 0 ? (
              notifications.map((item, index) => (
                <View key={index} style={styles.notificationItem}>
                  <Text style={styles.notificationText}>{item.message}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noNotifications}>No notifications</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );



  const HomePage = () => {
    if (isLoading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#274A8A" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load dashboard data</Text>
          <Button title="Retry" onPress={fetchData} color="#274A8A" />
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#274A8A']}
          />
        }>
        {/* Header */}
        <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu-outline" size={28} color="#fff" />
          </TouchableOpacity>

          <Image
            source={require('../assets/images/doc365-logo.png')}
            style={styles.logo}
          />

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.notificationIcon} onPress={handleBellClick} >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#fff"
              />
               {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{unreadCount}</Text>
              </View>
            )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => navigation.navigate('My Profile')}>
              <View style={styles.profileBadge}>
                <Image
                  source={{
                    uri: doctor.image_url || 'https://via.placeholder.com/100',
                  }}
                  
                  style={styles.profileImage}
                />
                 {console.log(' image : ', doctor.image_url)}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile and Location */}
        <View style={styles.ProfileLocationContainer}>
          <View style={styles.profileContainer}>
            <View style={styles.profileImageContainer}>
              <Text style={styles.profileImageText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            {/* Wrap the name Text with TouchableOpacity */}
            <TouchableOpacity onPress={() => navigation.navigate('My Profile')}>
              <Text style={styles.locationText}>
                Hi! {user?.name || 'User'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.locationContainer}>
            <FontAwesome
              name="map-marker"
              color="#f95959"
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>{cityName || 'Loading...'}</Text>
          </View>
        </View>

        {/* Main Card */}
        {/* <LinearGradient
          colors={[ '#e8e8fa', '#fff']}
          style={[styles.card, styles.cardShadow]}>
          <Image
            source={{
              uri: doctor.image_url || 'https://via.placeholder.com/100',
            }}
            style={styles.doctorImage}
          />
          {console.log('hospital image : ', doctor.image_url)}

          <View style={styles.cardButtons}>
            <View style={[styles.cardButtonContainer, styles.cardShadow]}>
              <LinearGradient
                colors={["#5f5dbd", "#5f5dbd"]}
                style={styles.cardButtonGradient}>
                <TouchableOpacity style={styles.cardButton}>
                  <Text style={styles.cardButtonText}>Total Earning</Text>
                  <Text style={styles.cardButtonText}>$0</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <View style={[styles.cardButtonContainer, styles.cardShadow]}>
              <LinearGradient
                colors={["#5f5dbd", "#5f5dbd"]}
                style={styles.cardButtonGradient}>
                <TouchableOpacity style={styles.cardButtonWithdraw}>
                  <Text style={styles.cardButtonText}>Total Withdraw</Text>
                  <Text style={styles.cardButtonText}>$ 0</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </LinearGradient> */}


   <TouchableOpacity 
            style={styles.appointmentCard}
            onPress={() => navigation.navigate('Upcomming Appointments')}>
            <View style={[styles.appointmentHeader, { backgroundColor: colors.primaryLight }]}>
              <View style={styles.appointmentHeaderContent}>
                <View style={styles.appointmentIcon}>
                  <FontAwesome5 name="calendar-check" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.appointmentTitle}>Upcoming Appointment</Text>
                  <Text style={styles.appointmentTime}>Today at 2:30 PM</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Upcomming Appointments')}>
            
              <Text style={styles.viewText}>
                View <FontAwesome name="chevron-right" size={10} color={colors.primary} />
              </Text>
        
              </TouchableOpacity>
                     </View>
          <View style={styles.appointmentBody}>
<Image
  source={{ uri: getAvatarUrl('Sarah Johnson') }}
  style={styles.doctorPic}
/>



            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>Dr. Sarah Johnson</Text>
              <Text style={styles.doctorSpecialty}>
                Cardiologist • 4.9 <FontAwesome name="star" size={12} color={colors.yellow} />
              </Text>
            </View>
            <TouchableOpacity style={styles.videoButton}>
              <FontAwesome5 name="video" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
    

          </TouchableOpacity>

        {/* Upcoming Appointments */}
        <View style={styles.upcomingContainer}>
          <Text style={styles.upcomingTitle}>Upcoming Appointment</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Upcomming Appointments')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Metric Cards Grid */}
       <View style={styles.servicesGrid}>
  {metrics.map((item, index) => (
    <TouchableOpacity 
      key={index}
      style={styles.serviceCard}
      onPress={() => navigation.navigate(item.screen)}>
      
       <View style={[styles.serviceIcon, { backgroundColor: colors.primaryLight }]}>
                <FontAwesome5 name={item.icon} size={16} color={colors.primary} />
              </View>

      <Text style={styles.metricValue}>{item.value}</Text>
      <Text style={styles.serviceName}>{item.name}</Text>
    </TouchableOpacity>
  ))}
</View>

 <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          {/* <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.servicesGrid}>
          {services.map((service, index) => (
            <TouchableOpacity key={index} style={styles.serviceCard}>
              <View style={[styles.serviceIcon, { backgroundColor: colors.primaryLight }]}>
                <FontAwesome5 name={service.icon} size={16} color={colors.primary} />
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Daily Tips */}
        <View style={styles.eventsContainer}>
          <Text style={styles.heading}>Latest Blogs</Text>
          <FlatList
            data={blog}
            renderItem={({item}) => <MemoizedBlogItem item={item} />}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
        
      </ScrollView>
      
    );
    
  };

  return (
    
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#ffb677',
        tabBarInactiveTintColor: '#fff',
        tabBarIndicatorStyle: {
          // This will create a background for the active tab
          backgroundColor: 'green',
          height: '80%',
          top: '10%',
          borderRadius: 10,
        },
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          backgroundColor: '#274A8A',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          drawerItemStyle: {display: 'none'},
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={TodayAppointments}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My Patients"
        component={MyPatients}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
   topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#f95959',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    padding: 8,
    marginRight: 8,
  },
  profileIcon: {
    padding: 4,
  },
  profileBadge: {
    backgroundColor: '#5585b5',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
   appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  appointmentHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentIcon: {
    backgroundColor: '#e8e8fa',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  appointmentTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  viewText: {
    color: '#5f5dbd',
    fontWeight: '500',
    fontSize: 14,
  },
  appointmentBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  doctorPic: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#d1d1f0',
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  doctorSpecialty: {
    fontSize: 12,
    color: '#6b7280',
  },
  videoButton: {
    backgroundColor: '#e8e8fa',
    padding: 10,
    borderRadius: 999,
  },
  seeAllText: {
    color: '#5f5dbd',
    fontSize: 14,
    fontWeight: '500',
    paddingRight:20,
  },  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 20,
    marginBottom: 12,
  }, servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    width: (width - 56) / 2,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
  fontSize: 20,
  fontWeight: 'bold',
  color: Color.blue1,
  marginBottom: 4,
},
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  logo: {
    marginLeft: 20,
    width: 220,
    height: 40,
    resizeMode: 'contain',
  },
  ProfileLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? 0 : 5,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    width: 30,
    height: 30,
    backgroundColor: '#222831',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  locationText: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  card: {
    width: '90%',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 5,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cardButtonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '48%',
  },
  cardButtonGradient: {
    borderRadius: 8,
    padding: 1,
  },
  cardButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  cardButtonWithdraw: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  upcomingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 5,
  },
  metricCard: {
    width: width * 0.43,
    height: 120,
    borderRadius: 12,
    padding: 15,
    justifyContent: 'space-between',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  metricIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  metricTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  eventsContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  flatListContainer: {
    paddingBottom: 10,
  },
  eventCardContainer: {
    width: 160,
    marginRight: 15,
  },
  eventCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
