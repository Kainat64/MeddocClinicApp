import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from '../Components/AuthContext';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUrl } from "../Utils/BaseApi";
import { FontFamily, Color, Padding, Border, FontSize } from '../GlobalStyles';
const CustomDrawerContent = (props) => {
    const { logout } = useAuth();
    const { user } = useAuth();
    const [doctor, setDoctor] = useState([]);
    useEffect(() => {
        fetchDoctor();
    }, []);
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
  
    

  const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
  return (
    <DrawerContentScrollView {...props}>
      {/* User Info Section */}
      <View style={{ padding: 20, backgroundColor: Color.blue1 }}>
        <Image
          source={{
            uri: user?.image_url || 'https://via.placeholder.com/100',}} // Replace with dynamic URL
          style={{ width: 60, height: 60, borderRadius: 30 }}
        />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, color: '#fff' }}>{user?.name}</Text>
        <Text style={{ fontSize: 14, color: '#fff' }}> {user?.email}</Text>
      </View>

      {/* Drawer Items */}
      <DrawerItemList {...props} />
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
          
          <TouchableOpacity style={{ paddingVertical: 15 }} onPress={handleLogout}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="exit-outline" size={22} color="#f95959" />
              <Text
                style={{
                  fontSize: 15,
                  color: "#f95959",
                  fontWeight: "500",
                  marginLeft: 5,
                }}
              >
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
