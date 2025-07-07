import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from '../../GlobalStyles';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

const SplashSlide = ({ navigation, slide, onContinue, onBack, currentIndex, totalSlides }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -SWIPE_THRESHOLD) {
          onContinue();
        } else if (gesture.dx > SWIPE_THRESHOLD && onBack) {
          onBack();
        }
      },
    })
  ).current;

  return (
    <LinearGradient colors={['#EEF1FF', '#EEF1FF']} style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.replace('Login')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <View style={styles.content}>
          <Text style={styles.title}>{slide.title}</Text>
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', '#8A8DFF', 'rgba(255,255,255,0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headingLine}
          />

          <Text style={styles.subtitle}>{slide.description}</Text>

          <LinearGradient
            colors={['rgba(255,255,255,0.2)', '#8A8DFF']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.imageBorder}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={slide.image}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </LinearGradient>

          <TouchableOpacity style={styles.button} onPress={onContinue}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', '#8A8DFF', 'rgba(255,255,255,0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.pagination}>
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <View
                key={idx}
                style={[styles.dot, currentIndex === idx && styles.activeDot]}
              />
            ))}
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#EEF1FF',
  },
  skipBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
   
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  headingLine: {
    width: 250,
    height: 3,
    borderRadius: 2,
    marginTop: 6,
    marginBottom: 16,
  },
  subtitle: {
      width:'70%',
    lineHeight:22,
    fontSize: 16,
    color: '#5e5e5e',
    textAlign: 'center',
    marginBottom: 10,
   
  },
  imageBorder: {
    padding: 18,

    marginBottom: 40,
  },
  imageWrapper: {
    backgroundColor: 'white',
   
    overflow: 'hidden',
  },
  image: {
    width: width * 0.6,
    height: width * 0.98,
  },
  button: {
    width: width * 0.9,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 30,
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#c1c1c1',
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#8A8DFF',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#8A8DFF', // violet border
  },

});

export default SplashSlide;
