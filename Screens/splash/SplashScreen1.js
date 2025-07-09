

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from '../../GlobalStyles';
const SplashScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        navigation.replace('Splash2');
      }, 1500);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={['#FFD700', '#5f5dbd']} // Gold to violet blue
          style={styles.gradientBorder}
        >
          <View style={styles.innerCircle}>
            <Image
              source={require('../../assets/images/logoo.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
        </LinearGradient>
      </Animated.View>
      <Text style={styles.title}>MEDDOC</Text>
    </View>
  );
};

export default SplashScreen;

const BORDER_WIDTH = 5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.blue1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBorder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    padding: BORDER_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    backgroundColor: '#fff', // to cut out the inner area
    width: 160 - BORDER_WIDTH * 2,
    height: 160 - BORDER_WIDTH * 2,
    borderRadius: (160 - BORDER_WIDTH * 2) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  title: {
    marginTop: 24,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});


