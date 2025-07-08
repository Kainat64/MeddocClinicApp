// components/UpcomingAppointmentCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Color } from '../../GlobalStyles';
import styles from './styles';

const UpcomingAppointmentCard = ({ navigation, getAvatarUrl }) => (
  <TouchableOpacity
    style={styles.appointmentCard}
    onPress={() => navigation.navigate('Upcomming Appointments')}>
    <View style={[styles.appointmentHeader, { backgroundColor: '#e8e8fa' }]}>
      <View style={styles.appointmentHeaderContent}>
        <View style={styles.appointmentIcon}>
          <FontAwesome5 name="calendar-check" size={20} color={Color.blue1} />
        </View>
        <View>
          <Text style={styles.appointmentTitle}>Upcoming Appointment</Text>
          <Text style={styles.appointmentTime}>Today at 2:30 PM</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Upcomming Appointments')}>
        <Text style={styles.viewText}>
          View <FontAwesome name="chevron-right" size={10} color={Color.blue1} />
        </Text>
      </TouchableOpacity>
    </View>
    <View style={styles.appointmentBody}>
      <Image source={{ uri: getAvatarUrl('Sarah Johnson') }} style={styles.doctorPic} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>Dr. Sarah Johnson</Text>
        <Text style={styles.doctorSpecialty}>
          Cardiologist • 4.9 <FontAwesome name="star" size={12} color={'#f59e0b'} />
        </Text>
      </View>
      <TouchableOpacity style={styles.videoButton}>
        <FontAwesome5 name="video" size={14} color={Color.blue1} />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default UpcomingAppointmentCard;