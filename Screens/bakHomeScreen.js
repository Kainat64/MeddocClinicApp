import React from 'react';
import { Dimensions, View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // For icons
import { useAuth } from '../Components/AuthContext';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const { width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
const HomeScreen = ({navigation}) => {
  const { logout } = useAuth();
  const { user } = useAuth();

  // Logout function
  const handleLogout = async () => {
    logout();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/doc365-logo.png')} style={styles.logo} />
        <View style={styles.userActions}>
          <Icon name="notifications-outline" size={24} color="#53a8b6" />
          <Icon name="person-circle-outline" size={24} color="#53a8b6" style={styles.profileIcon} />
        </View>
      </View>

      <Text style={styles.greeting}>Hello! {user?.name || 'user' }!</Text>
      <View style={styles.locationRow}>
        <Icon name="location-outline" size={16} color="#000" />
        <Text style={styles.locationText}>Galway</Text>
      </View>
      
      <View style={styles.appointmentSection}>
      <TouchableOpacity>
        <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {handleLogout}}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
     
      

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridItem}>
          <ImageBackground source={require('../assets/images/frame1.png')} style={styles.gridImageBackground}>
            <Text style={styles.gridText}>My profile</Text>
            <Image source={require('../assets/images/doctor.png')} style={[styles.gridImage, styles.mt30]} />
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <ImageBackground source={require('../assets/images/frame2.png')} style={styles.gridImageBackground}>
            <Text style={styles.gridText}> My earnings</Text>
            <Image source={require('../assets/images/earnings.png')} style={styles.gridImage} />
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Today Appointments')}>
          <ImageBackground source={require('../assets/images/frame3.png')} style={styles.gridImageBackground}>
            <Text style={styles.gridText}>Today </Text>
            <Text style={styles.gridSubText}>Appointments</Text>
            <Image source={require('../assets/images/current_appointments.png')} style={[styles.gridImage, styles.mb20]} />
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <ImageBackground source={require('../assets/images/frame4.png')} style={styles.gridImageBackground}>
            <Text style={styles.gridText}>Pending</Text>
            <Text style={styles.gridSubText}>Appointments</Text>
            <Image source={require('../assets/images/pending_appointments.png')} style={[styles.gridImage,styles.mb20]} />
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem}>
          <ImageBackground source={require('../assets/images/frame5.png')} style={styles.gridImageBackground}>
            <Text style={styles.gridText}>Canceled </Text>
            <Text style={styles.gridSubText}>Appointments</Text>
            <Image source={require('../assets/images/cancel_appointments.png')} style={[styles.gridImage, styles.mb20]} />
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('My Patients')}>
          <ImageBackground source={require('../assets/images/frame6.png')} style={styles.gridImageBackground}>
            <Text style={styles.gridText}>My Patients</Text>
            <Image source={require('../assets/images/patients_list.png')} style={[styles.gridImage, styles.mb20]} />
          </ImageBackground>
        </TouchableOpacity>
      </View>
      {/* Blog Section */}
      <View style={styles.blogSection}>
        <Text style={styles.blogTitle}>How can we help you today?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.blogScroll}>
          <TouchableOpacity style={styles.blogItem}>
            <Image source={require('../assets/images/heart_health.png')} style={styles.blogImage} />
            <Text style={styles.blogText}>Daily Tips for Prioritizing Your Heart Health</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.blogItem}>
            <Image source={require('../assets/images/heart_health.png')} style={styles.blogImage} />
            <Text style={styles.blogText}>Healthy Whole Foods for Optimal Heart Health</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  logo: {
    width: 130,
    height: 30,
    resizeMode: 'contain',
  },
  userActions: {
    flexDirection: 'row',
  },
  profileIcon: {
    marginLeft: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    marginVertical: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#555',
  },
  appointmentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#005EB8',
    fontSize: 14,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 20,
  },
  gridItem: {
    width: '48%',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative', // Added for positioning the gridImage
  },
  gridImageBackground: {
    width: '100%',
    height: 150, // Adjust height as per the design
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative',
  },
  gridText: {
    fontSize: 16,
    
    fontWeight: 'bold',
    position: 'absolute', // Positioning the text absolutely
    top: 10,
    left: 10,
    zIndex: 1, // Ensure text is on top of images
  },
  gridImage: {
    width: 80, // Adjust width to fit the layout
    height: 80, // Adjust height to fit the layout
    position: 'absolute', // Positioning the icon absolutely
    right: 10, // Positioning on the right side
    bottom: 1, // Adjust to fit within the grid item
  },
  mt10:{
    marginTop:10,
  },
  mt20:{
    marginTop:20,
  },
  mt30:{
    marginTop:30,
  },
  mb10:{
    marginBottom:10,
  },
  mb20:{
    marginBottom:20,
  },
  gridSubText:{
    fontSize: 16,
    marginTop:20,
    fontWeight: 'bold',
    position: 'absolute', // Positioning the text absolutely
    top: 10,
    left: 10,
    zIndex: 1,
  },
  // Blog Section
  blogSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  blogScroll: {
    flexDirection: 'row',
  },
  blogItem: {
    width: 180,
    marginRight: 10,
  },
  blogImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  blogText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default HomeScreen;
