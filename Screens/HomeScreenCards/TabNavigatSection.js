 
 import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Color } from '../../GlobalStyles';
import HomeScreen from '../HomeScreen';
import TodayAppointments from '../Appointments/TodayAppointments';
import MyPatients from '../Appointments/MyPatients';
import ProfileScreen from '../ProfileScreen';
const Tab = createBottomTabNavigator();
 
 const TabNavigator = () => {
    return(
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
          backgroundColor: Color.blue1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      <Tab.Screen
        name=" Home "
        component={HomeScreen}
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
        name=" My Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    )}
  export default TabNavigator;