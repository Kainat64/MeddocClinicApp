import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  Button,
} from 'react-native';
import { useAuth } from '../Components/AuthContext';
import { BaseUrl } from '../Utils/BaseApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color } from '../GlobalStyles';
import TopBar from './HomeScreenCards/TopBar';
import ProfileLocationSection from './HomeScreenCards/ProfileLocation';
import UpcomingAppointmentCard from './HomeScreenCards/UpcomingAppointmentCard';
import MetricsGrid from './HomeScreenCards/MetricsGrid';
import ServicesGrid from './HomeScreenCards/ServicesGrid';
import LatestBlogs from './HomeScreenCards/LatestBlogs';
import NotificationModal from './HomeScreenCards/NotificationModal';
import useLocation from '../Utils/hooks/useLocation';

const HomeScreen = ({ navigation }) => {
  const { logout, user } = useAuth();
  const [doctor, setDoctor] = useState({});
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [upcommingAppointments, setUpcommingAppointments] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [countPatients, setCountPatients] = useState(0);
  const [blog, setBlog] = useState([]);
 const { cityName } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const services = [
    { icon: 'heartbeat', name: 'Heart Checkup', description: 'Cardiac assessment' },
    { icon: 'brain', name: 'Mental Health', description: 'Therapy services' },
    { icon: 'baby', name: 'Pediatrics', description: 'Child healthcare' },
    { icon: 'tooth', name: 'Dental Care', description: 'Oral health' },
  ];

  const metrics = [
    { icon: 'calendar', name: 'Today Appointments', value: todayAppointments, screen: 'Today Appointments' },
    { icon: 'wallet', name: 'Prescription History', screen: ' Prescription History' },
    { icon: 'clock', name: 'Upcoming Appointment', value: upcommingAppointments, screen: 'Upcomming Appointments' },
    { icon: 'users', name: 'My Patients', value: countPatients, screen: 'My Patients' },
  ];

const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await Promise.all([
        fetchDoctor(),
        countAppointments(),
        fetchBlog(),
        fetchNotifications(),
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [fetchDoctor, countAppointments, fetchBlog, fetchNotifications]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);
 

const fetchDoctor = useCallback(async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    let endpoint =
      user?.type === 'doctor'
        ? '/get-doctor-app-profile'
        : '/get-hospitals-profile';

    const response = await axios.get(`${BaseUrl}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setDoctor(user?.type === 'doctor' ? response.data : response.data[0]);
  } catch (error) {
    throw error;
  }
}, [user]);


const countAppointments = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${BaseUrl}/count-appointments-by-doctorId`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTodayAppointments(response.data.todayAppointments);
    setUpcommingAppointments(response.data.upcomingAppointments);
    setTotalAppointments(response.data.totalAppointments);
    setCountPatients(response.data.countPatient);
  }, []);
const fetchBlog = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${BaseUrl}/blog-posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBlog(response.data);
  }, []);

  const fetchNotifications = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${BaseUrl}/get-user-notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(response.data.notifications);
    setUnreadCount(response.data.unread_count);
  }, []);

  const markNotificationsAsRead = useCallback(async () => {
    const token = await AsyncStorage.getItem('userToken');
    await axios.post(`${BaseUrl}/mark-read-user-notifications`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUnreadCount(0);
  }, []);

 const getAvatarUrl = useCallback((name, size = 60) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=5f5dbd&color=ffffff&size=${size}`,
    []
  );

  if (isLoading && !refreshing) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={Color.blue1} /></View>;
  }

  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
      <Button title="Retry" onPress={fetchData} />
    </View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Color.blue1]} />}>

        <TopBar navigation={navigation} doctor={doctor} unreadCount={unreadCount} onBellClick={() => setShowNotifications(true)} />

        <ProfileLocationSection user={user} cityName={cityName} navigation={navigation} />

        <UpcomingAppointmentCard navigation={navigation} getAvatarUrl={getAvatarUrl} />

        <MetricsGrid metrics={metrics} navigation={navigation} />

        <ServicesGrid services={services} />

        <LatestBlogs blog={blog} navigation={navigation} />

      </ScrollView>

      <NotificationModal
        visible={showNotifications}
        onClose={() => {
          setShowNotifications(false);
          markNotificationsAsRead();
        }}
        notifications={notifications}
      />
    </View>
  );
};




export default HomeScreen;
