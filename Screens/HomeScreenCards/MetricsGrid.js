import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Color } from '../../GlobalStyles';
import styles from './styles';

const MetricsGrid = ({ metrics, navigation }) => (
  <View style={styles.servicesGrid}>
    {metrics.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={styles.serviceCard}
        onPress={() => navigation.navigate(item.screen)}
      >
        {/* Horizontal layout: icon + value */}
        <View style={styles.iconValueContainer}>
          <View style={[styles.serviceIcon, { backgroundColor: '#e8e8fa' }]}>
            <FontAwesome5 name={item.icon} size={16} color={Color.blue1} />
          </View>
          <Text style={styles.metricValue}>{item.value}</Text>
        </View>
        <Text style={styles.serviceName}>{item.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default MetricsGrid;
