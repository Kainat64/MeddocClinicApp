// components/TopBar.js
import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { Color } from '../../GlobalStyles';
import { useNavigation } from '@react-navigation/native';

const TopBar = ({ unreadCount, doctor, onBellClick }) => {
  const navigation = useNavigation();
  const handleOpenDrawer = () => {
    if (navigation?.openDrawer) {
      navigation.openDrawer(); // ✅ Only call if available
    }
  };

  return (
    <View style={[styles.topBar, { backgroundColor: Color.blue1 }]}>
      <TouchableOpacity onPress={handleOpenDrawer}>
        <Ionicons name="menu-outline" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image source={require('../../assets/images/logoo.png')} style={styles.logo} />
        </View>
        <View>
          <Text style={styles.appName}>Meddoc365</Text>
          <Text style={styles.appTagline}>Your health companion</Text>
        </View>
      </View>

      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.notificationIcon} onPress={onBellClick}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate(' My Profile')}>
          <Image
            source={{ uri: doctor.image_url || 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;
