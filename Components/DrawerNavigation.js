// navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from "../Screens/HomeScreen";

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

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
     <Drawer.Screen name="Home" component={HomeScreen}
      options={{
        drawerItemStyle: { display: 'none' },
        headerShown: false,
      }} />
       <Drawer.Screen name="Today Appointments" component={TodayAppointments}
      options={{
        drawerItemStyle: { display: 'none' },
       
      }} />
       <Drawer.Screen name="Upcomming Appointments" component={UpcommingAppointments}
      options={{
       
       
      }} />
       <Drawer.Screen name="My Patients" component={MyPatients}
      options={{
        drawerItemStyle: { display: 'none' },
       
      }} />
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
       <Drawer.Screen name="My Earning" component={MyEarningScreen}
      options={{
        drawerItemStyle: { display: 'none' },
       
      }} />
       <Drawer.Screen name="Withdraw" component={WidthdrawScreen}
      options={{
        drawerItemStyle: { display: 'none' },
       
      }} />
      <Drawer.Screen name="My Dashboard" component={DashboardScreen}
      options={{
        drawerItemStyle: { display: 'none' },
       
      }} />
       <Drawer.Screen name="My Profile" component={ProfileScreen}
      options={{
        drawerItemStyle: { display: 'none' },
       
      }} />
      <Drawer.Screen name="Blog Details" component={BlogScreen}
      options={{
        drawerItemStyle: { display: 'none' },
       
      }} />
      
    </Drawer.Navigator>
  );
}
