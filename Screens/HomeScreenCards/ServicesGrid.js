import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Color } from '../../GlobalStyles';
import styles from './styles';

const ServicesGrid = ({ services }) => (
  <> 
  <Text style={styles.sectionTitle}>Our Services</Text>
  <View style={styles.servicesGrid}>
    
    {services.map((service, index) => (
      <TouchableOpacity key={index} style={styles.serviceCard}>
        <View style={[styles.serviceIcon, { backgroundColor: '#e8e8fa' }]}>
          <FontAwesome5 name={service.icon} size={16} color={Color.blue1} />
        </View>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>
      </TouchableOpacity>
    ))}
  </View></>
);

export default ServicesGrid;