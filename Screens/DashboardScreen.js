import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Icon name="location-outline" size={16} color="#000" />
        </TouchableOpacity>
        <Text style={styles.logoText}>App Logo</Text>
        <View style={styles.topRight}>
          <Icon name="location-outline" size={16} color="#000" />
          <Image
            style={styles.profileImage}
            source={{uri: 'https://via.placeholder.com/40'}}
          />
        </View>
      </View>

      {/* Doctor Section */}
      <View style={styles.doctorSection}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>My Earnings</Text>
            <Text style={styles.cardAmount}>$1234</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Withdrawn</Text>
            <Text style={styles.cardAmount}>$567</Text>
          </View>
        </View>
        <Image
          style={styles.doctorImage}
          source={{uri: 'https://via.placeholder.com/100'}}
        />
      </View>

      {/* 4 Cards Section */}
      <View style={styles.cardsSection}>
        <View style={styles.grid}>
          <View style={styles.featureCard}>
            <Icon name="location-outline" size={16} color="#000" />
            <Text style={styles.featureTitle}>Today's Appointments</Text>
            <Text style={styles.featureFigure}>5</Text>
          </View>
          <View style={styles.featureCard}>
            <Icon name="location-outline" size={16} color="#000" />
            <Text style={styles.featureTitle}>Upcoming Appointments</Text>
            <Text style={styles.featureFigure}>3</Text>
          </View>
          <View style={styles.featureCard}>
            <Icon name="location-outline" size={16} color="#000" />
            <Text style={styles.featureTitle}>My Patients</Text>
            <Text style={styles.featureFigure}>12</Text>
          </View>
          <View style={styles.featureCard}>
            <Icon name="location-outline" size={16} color="#000" />
            <Text style={styles.featureTitle}>My Profile</Text>
          </View>
        </View>
      </View>

      {/* Bottom Tab Navigation */}
    </View>
  );
};

const BottomTabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="location-outline" size={16} color="#000" />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="location-outline" size={16} color="#000" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="location-outline" size={16} color="#000" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8f9fa'},
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 4,
  },
  logoText: {fontSize: 20, fontWeight: 'bold'},
  topRight: {flexDirection: 'row', alignItems: 'center'},
  profileImage: {width: 40, height: 40, borderRadius: 20, marginLeft: 10},
  doctorSection: {
    backgroundColor: '#274A8A',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  doctorImage: {width: 100, height: 100, borderRadius: 50},
  cardContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  cardTitle: {fontSize: 16, fontWeight: 'bold'},
  cardAmount: {fontSize: 24, fontWeight: 'bold', color: '#274A8A'},
  cardsSection: {padding: 20},
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  featureCard: {
    backgroundColor: 'linear-gradient(45deg, #6b63ff, #74ebd5)',
    padding: 20,
    borderRadius: 15,
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  featureFigure: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default DashboardScreen;
