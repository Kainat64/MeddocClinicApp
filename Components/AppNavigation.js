import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from "./AuthContext";
import { ActivityIndicator, View } from 'react-native';
import SplashScreen1 from "../Screens/splash/SplashScreen1";
import SplashScreen2 from "../Screens/splash/SplashScreen2";
import SplashScreen3 from "../Screens/splash/SplashScreen3";
import SplashScreen4 from "../Screens/splash/SplashScreen4";
import LoginScreen from "../Screens/Login/LoginScreen";
import HomeScreen from "../Screens/HomeScreen";
const AuthStack = createNativeStackNavigator();
import TodayAppointments from "../Screens/Appointments/TodayAppointments";
import UpcommingAppointments from "../Screens/Appointments/UpcommingAppointments";
import MyPatients from "../Screens/Appointments/MyPatients";
import AvailableMedicine from "../Screens/Prescriptions/AvailableMedicine";
import PrescriptionScreen from "../Screens/Prescriptions/PrescriptionScreen";
import PharmacyListScreen from "../Screens/Prescriptions/PharmacyScreen";
import SummaryScreen from "../Screens/Prescriptions/SummaryScreen";
import MyEarningScreen from "../Screens/Payments/MyEarningScreen";
import WidthdrawScreen from "../Screens/Payments/WidthdrawScreen";
import DashboardScreen from "../Screens/DashboardScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import BlogScreen from "../Screens/Blogs/BlogScreen";
import PrescriptionHistoryScreen from "../Screens/PrescriptionHistory/PrescriptionHistoryScreen";
import PrescriptionDetailScreen from "../Screens/PrescriptionHistory/PrescriptionDetailScreen";
import DrawerNavigator from "./DrawerNavigation";
import { createDrawerNavigator } from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();
import CustomDrawerContent from "./CustomDrawerContent ";
import JoinMeetingScreen from "../Screens/ZoomMeet/JoinMeetScreen";
import { FontFamily, Color, Padding, Border, FontSize } from '../GlobalStyles';

import HomeWithTabs from "../Screens/HomeWithTabs";

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Splash1" component={SplashScreen1} options={{ headerShown: false }} />
    <AuthStack.Screen name="Splash2" component={SplashScreen2} options={{ headerShown: false }} />
    <AuthStack.Screen name="Splash3" component={SplashScreen3} options={{ headerShown: false }} />
    <AuthStack.Screen name="Splash4" component={SplashScreen4} options={{ headerShown: false }} />
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
  </AuthStack.Navigator>
);
// Main app stack for logged-in users
const AppStack = createNativeStackNavigator();
const AppNavigator = () => (

  <Drawer.Navigator 
    initialRouteName="Home"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
          drawerActiveTintColor: Color.blue1, // set your preferred color
    drawerInactiveTintColor: '#666',
    drawerActiveBackgroundColor: Color.secondary,
      // Common styles for all drawer items
      drawerItemStyle: {
     display:'flex',
     gap:10,
    
      },
      drawerLabelStyle: {
        // Adjust this value based on your icon size
        fontSize: 12,
      },
      drawerIconContainerStyle: {
        width: 40, // Fixed width for icon container
      }
    }}
  >

<Drawer.Screen name="Home" component={HomeWithTabs} 

   options={{
    headerShown: false,
    drawerIcon: ({ color, size }) => (
      <FontAwesome name="home" size={18} color={color} />
    ),
  }} 
   />


    <Drawer.Screen name="My Profile" component={ProfileScreen}
    options={{
      headerShown: false,
      drawerIcon: ({ color, size }) => (
        <FontAwesome name="user" size={19} color={color} />
      ),
    }}  />
    <Drawer.Screen name="Today Appointments" component={TodayAppointments}
    options={{
      headerShown: true,
      drawerIcon: ({ color, size }) => (
        <FontAwesome name="clock-o" size={20} color={color} />
      ),
    }} 
   />
    <Drawer.Screen name="Upcomming Appointments" component={UpcommingAppointments}
   options={{
    headerShown: false,
    drawerIcon: ({ color, size }) => (
      <FontAwesome name="calendar" size={20} color={color} />
    ),
  }}  />
    <Drawer.Screen name="My Patients" component={MyPatients}
  options={{
    headerShown: true,
    drawerIcon: ({ color, size }) => (
      <FontAwesome name="users" size={18} color={color} />
    ),
  }}  />
    <Drawer.Screen name="Available Medicines" component={AvailableMedicine}
   options={{
     drawerItemStyle: { display: 'none' },
    
   }} />
   <Drawer.Screen name="Prescription" component={PrescriptionScreen}
   options={{
     drawerItemStyle: { display: 'none' },
    
   }} />
   <Drawer.Screen name="Pharmacies List" component={PharmacyListScreen}
   options={{
     drawerItemStyle: { display: 'none' },
    
   }} />
   <Drawer.Screen name="Summary" component={SummaryScreen}
   options={{
     drawerItemStyle: { display: 'none' },
    
   }} />
    <Drawer.Screen name=" My Earning" component={MyEarningScreen}
  options={{
    drawerItemStyle: { display: 'none' },
  }}  />
    <Drawer.Screen name="Withdraw" component={WidthdrawScreen}
   options={{
     drawerItemStyle: { display: 'none' },
    
   }} />
   <Drawer.Screen name="My Dashboard" component={DashboardScreen}
   options={{
     drawerItemStyle: { display: 'none' },
    
   }} />
   
   <Drawer.Screen name="Blog Details" component={BlogScreen}
   options={{
     drawerItemStyle: { display: 'none' },
    
   }} />
   <Drawer.Screen name=" Prescription History" component={PrescriptionHistoryScreen}
   options={{
     headerShown: false,
     drawerIcon: ({ color, size }) => (
       <FontAwesome name="history" size={20} color={color} />
     ),
   }} />
    <Drawer.Screen name="Prescription Detail" component={PrescriptionDetailScreen}
   options={{
    drawerItemStyle: { display: 'none' },
   }} />
     <Drawer.Screen name="Join Meet" component={JoinMeetingScreen}
   options={{
    drawerItemStyle: { display: 'none' },
   }} />
 </Drawer.Navigator>
)
const Appnavigation  = () => {
    const { user, loading } = useAuth(); // Get user and loading state from AuthContext


    // Debugging - Check user state from AuthContext
  console.log("AuthContext:", { user, loading });

  // Show a loading spinner while checking authentication status
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
    return(
        <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    )
}
export  default Appnavigation;