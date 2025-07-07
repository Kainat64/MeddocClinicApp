// src/services/settingsService.js

import axios from 'axios';
import {BaseUrl} from '../Utils/BaseApi'; // Your current base URL for API calls
import AsyncStorage from '@react-native-async-storage/async-storage';



let appSettings = {};

export const fetchSettings = async () => {
  try {
     const token = await AsyncStorage.getItem('userToken'); // or from context/store
    const response = await axios.get(`${BaseUrl}/getsettings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    appSettings = response.data;
    console.log("api key settings", response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    throw error;
  }
};


export const getSetting = (key) => {
  if (!appSettings) {
    throw new Error('Settings not loaded. Call fetchSettings() first.');
  }
  return appSettings[key];
};

export const getSettings = () => {
  if (!appSettings) {
    throw new Error('Settings not loaded. Call fetchSettings() first.');
  }
  return appSettings;
};