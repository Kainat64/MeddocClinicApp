// components/ProfileLocationSection.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

const ProfileLocationSection = ({ user, cityName, navigation }) => (
  <View style={styles.ProfileLocationContainer}>
    <View style={styles.profileContainer}>
      <View style={styles.profileImageContainer}>
        <Text style={styles.profileImageText}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('My Profile')}>
        <Text style={styles.locationText}>Hi! {user?.name || 'User'}</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.locationContainer}>
      <FontAwesome name="map-marker" color="#f95959" style={styles.locationIcon} />
      <Text style={styles.locationText}>{cityName || 'Loading...'}</Text>
    </View>
  </View>
);

export default ProfileLocationSection;
