import React, { useEffect, useState } from 'react';
import { 
  View, 
  ActivityIndicator, 
  Linking, 
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BaseUrl } from '../../Utils/BaseApi';
import Icon from 'react-native-vector-icons/Ionicons';

const MAX_RETRIES = 3;

const JoinMeetingScreen = ({ route, navigation }) => {
  const { meetingId } = route.params;
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  
  console.log('Meeting ID In Join:', meetingId);

  const fetchMeetingDetails = async (retryCount = 0) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BaseUrl}/join-meeting/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
       
        timeout: 10000
      });
      
      setMeeting(response.data);
      console.log('Meeting Details:', response.data);
      setLoading(false);
      
      // Try to open in Zoom app first
      const zoomUrl = response.data.join_url || `zoomus://zoom.us/join?confno=${meetingId}`;
      console.log('Zoom URL:', zoomUrl);
      
      const supported = await Linking.canOpenURL(zoomUrl);
      if (supported) {
        await Linking.openURL(zoomUrl);
      } else {
        setUsingFallback(true);
      }
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchMeetingDetails(retryCount + 1);
      }
      
      setError(error.message || 'Network request failed');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingDetails();
  }, [meetingId]);

  const handleOpenInBrowser = () => {
    if (meeting?.join_url) {
      Linking.openURL(meeting.join_url.replace('zoomus://', 'https://'));
    } else {
        Linking.openURL(`https://zoom.us/j/${meetingId}`);
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchMeetingDetails();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#274A8A" />
        <Text style={styles.loadingText}>Loading meeting details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="warning-outline" size={50} color="#ff4444" />
          <Text style={styles.errorText}>Failed to load meeting</Text>
          <Text style={styles.errorSubText}>{error}</Text>
          
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (usingFallback || !meeting?.join_url) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.fallbackContainer}>
          <Icon name="videocam-outline" size={60} color="#274A8A" />
          <Text style={styles.fallbackTitle}>Zoom Meeting</Text>
          <Text style={styles.fallbackText}>
            {meeting?.meeting_topic || `Meeting ID: ${meetingId}`}
          </Text>
          
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={handleOpenInBrowser}
          >
            <Text style={styles.joinButtonText}>Join in Browser</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: meeting.join_url.replace('zoomus://', 'https://') }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#274A8A" />
          </View>
        )}
        style={{ flex: 1 }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          setUsingFallback(true);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
    width: '90%',
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444',
    marginTop: 10,
    fontWeight: 'bold',
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 20,
  },
  fallbackContainer: {
    alignItems: 'center',
    padding: 20,
    width: '90%',
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  fallbackText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  joinButton: {
    backgroundColor: '#274A8A',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#274A8A',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#274A8A',
  },
  secondaryButtonText: {
    color: '#274A8A',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JoinMeetingScreen;