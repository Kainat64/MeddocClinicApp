import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Appnavigation from './Components/AppNavigation';
import { AuthProvider } from './Components/AuthContext';

const App = () => {
  return (
    <AuthProvider>
       <Appnavigation/>
    </AuthProvider>
  );
};

export default App;
