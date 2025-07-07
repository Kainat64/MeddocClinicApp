import React, {createContext, useContext, useState, useEffect} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BaseUrl} from '../Utils/BaseApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null,
  });

  // Check authentication status on app start
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setAuthState(prev => ({...prev, loading: false}));
          return;
        }

        // Verify token and get user data
        const response = await axios.get(`${BaseUrl}/user`, {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (response.data?.type !== 'doctor' && response.data?.type !== 'hospital') {
          await AsyncStorage.removeItem('userToken');
          setAuthState({user: null, loading: false, error: null});
          return;
        }

        setAuthState({
          user: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Auth check error:', error);
        await AsyncStorage.removeItem('userToken');
        setAuthState({
          user: null,
          loading: false,
          error: 'Session expired. Please login again.',
        });
      }
    };

    loadAuthState();
  }, []);

  const login = async (email, password) => {
    setAuthState(prev => ({...prev, loading: true, error: null}));

    try {
      const response = await axios.post(`${BaseUrl}/login`, {email, password});
      const {token, user} = response.data;

      if (user.type !== 'doctor' && user.type !== 'hospital') {
        Alert.alert(
          'Access Denied',
          'Only doctors can access this application',
          [{text: 'OK'}],
        );
        setAuthState(prev => ({...prev, loading: false}));
        return false;
      }

      await AsyncStorage.setItem('userToken', token);
      setAuthState({
        user,
        loading: false,
        error: null,
      });
      return true;
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      Alert.alert('Login Error', errorMessage);
      setAuthState({
        user: null,
        loading: false,
        error: errorMessage,
      });
      return false;
    }
  };

  const signup = async (name, email, password) => {
    setAuthState(prev => ({...prev, loading: true, error: null}));

    try {
      const response = await axios.post(`${BaseUrl}/signup`, {
        name,
        email,
        password,
      });
      const {token, user} = response.data;

      await AsyncStorage.setItem('userToken', token);
      setAuthState({
        user,
        loading: false,
        error: null,
      });
      return true;
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';

      if (error.response?.data?.errors) {
        // Handle validation errors from server
        errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert('Signup Error', errorMessage);
      setAuthState(prev => ({...prev, loading: false, error: errorMessage}));
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        await axios.post(`${BaseUrl}/logout`, null, {
          headers: {Authorization: `Bearer ${token}`},
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('userToken');
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        loading: authState.loading,
        error: authState.error,
        login,
        signup,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
