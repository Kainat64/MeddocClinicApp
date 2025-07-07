// // HomeScreen.js
// import * as React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   ImageBackground,
//   Dimensions,
//   TouchableOpacity,
//   Animated,
//   Easing,
//   StatusBar
// } from 'react-native';
// import {StyleSheet} from 'react-native';
// const {width, height} = Dimensions.get('window');

// function SplashScreen1({navigation}) {
//   // Animation values
//   const fadeAnim = React.useRef(new Animated.Value(0)).current;
//   const slideAnim = React.useRef(new Animated.Value(20)).current;
  
//   // New animation values for pulsating effect
//   const pulseAnim = React.useRef(new Animated.Value(0)).current;
//   const dotAnimations = React.useRef([]).current;

//   // Initialize dot animations with new properties
//   const initializeDotAnimations = () => {
//     const dots = [];
//     for (let i = 0; i < 12; i++) {
//       dots.push({
//         position: new Animated.Value(0),
//         scale: new Animated.Value(0),
//         opacity: new Animated.Value(0),
//         color: i % 3 === 0 ? '#274A8A' : i % 3 === 1 ? '#4CAF50' : '#FF5722',
//         delay: i * 150 // Staggered delay
//       });
//     }
//     return dots;
//   };

//   const [dots] = React.useState(initializeDotAnimations());

//   React.useEffect(() => {
//     // Pulsating animation for the central circle
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 0,
//           duration: 1000,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         })
//       ])
//     ).start();

//     // Main animations
//     Animated.parallel([
//       // Text animations
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1500,
//         easing: Easing.ease,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 1500,
//         easing: Easing.out(Easing.exp),
//         useNativeDriver: true,
//       }),
      
//       // Dot animations
//       Animated.stagger(100,
//         dots.map(dot => 
//           Animated.parallel([
//             Animated.timing(dot.opacity, {
//               toValue: 1,
//               duration: 500,
//               useNativeDriver: true,
//             }),
//             Animated.spring(dot.scale, {
//               toValue: 1,
//               friction: 4,
//               tension: 30,
//               useNativeDriver: true,
//             }),
//             Animated.timing(dot.position, {
//               toValue: 1,
//               duration: 2000,
//               easing: Easing.out(Easing.quad),
//               useNativeDriver: true,
//               delay: dot.delay
//             })
//           ])
//         )
//       )
//     ]).start();

//     const timer = setTimeout(() => {
//       navigation.navigate('Splash2');
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [navigation, fadeAnim, slideAnim, pulseAnim, dots]);

//   const renderDots = () => {
//     return dots.map((dot, index) => {
//       const angle = (index * (360 / dots.length)) * Math.PI / 180;
//       const radius = 150; // distance from center

//       const translateX = dot.position.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, radius * Math.cos(angle)]
//       });

//       const translateY = dot.position.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, radius * Math.sin(angle)]
//       });

//       return (
//         <Animated.View
//           key={index}
//           style={[
//             styles.dot,
//             {
//               backgroundColor: dot.color,
//               opacity: dot.opacity,
//               transform: [
//                 { translateX },
//                 { translateY },
//                 { scale: dot.scale }
//               ]
//             }
//           ]}
//         />
//       );
//     });
//   };

//   const pulseInterpolation = pulseAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 1.05]
//   });

//   return (
//     <>
//       <StatusBar hidden />
//       <View style={styles.container}>
//         <ImageBackground
//           source={require('../../assets/images/app_background.png')}
//           style={styles.imgContainer}
//           resizeMode="cover">
          
//           <View style={styles.contentContainer}>
//             <View style={styles.logoContainer}>
//               <Image
//                 source={require('../../assets/images/logo.png')}
//                 style={styles.logo}
//               />
//             </View>
            
//             <View style={styles.circleWrapper}>
//               <Animated.View style={[
//                 styles.circle, 
//                 { transform: [{ scale: pulseInterpolation }] }
//               ]} />
//               <Animated.Image
//                 source={require('../../assets/images/splash1_img.png')}
//                 style={[
//                   styles.imgCircle,
//                   { transform: [{ scale: pulseInterpolation }] }
//                 ]}
//               />
//               {renderDots()}
//             </View>

//             <View style={styles.bottomContainer}>
//               <Animated.Text 
//                 style={[
//                   styles.welcomeText,
//                   {
//                     opacity: fadeAnim,
//                     transform: [{ translateY: slideAnim }],
//                   }
//                 ]}>
//                 Welcome to
//               </Animated.Text>
//               <Animated.Text 
//                 style={[
//                   styles.appNameText,
//                   {
//                     opacity: fadeAnim,
//                     transform: [{ translateY: slideAnim }],
//                   }
//                 ]}>
//                 Doctors 365
//               </Animated.Text>
              
//               <TouchableOpacity 
//                 onPress={() => navigation.navigate('Login')}
//                 style={styles.button}>
//                 <Text style={styles.buttonText}>Get Started</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ImageBackground>
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'transparent',
//   },
//   imgContainer: {
//     flex: 1,
//     width: width,
//     height: height,
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   logo: {
//     width: 200,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   imgCircle: {
//     width: 250,
//     height: 250,
//     resizeMode: 'contain',
//   },
//   circleWrapper: {
//     position: 'relative',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 300,
//     height: 300,
//     marginVertical: 20,
//   },
//   circle: {
//     position: 'absolute',
//     width: 280,
//     height: 280,
//     borderRadius: 140,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     borderWidth: 2,
//     borderColor: '#c4bbf0',
//   },
//   dot: {
//     position: 'absolute',
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//   },
//   bottomContainer: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   welcomeText: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#274A8A',
//     marginBottom: 10,
//   },
//   appNameText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#274A8A',
//     marginBottom: 30,
//   },
//   button: {
//     backgroundColor: '#274A8A',
//     width: width * 0.9,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 3,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default SplashScreen1;


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



// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// const { width } = Dimensions.get('window');

// const SplashScreen = ({ navigation }) => {
//   return (
//     <LinearGradient colors={['#EEF1FF', '#EEF1FF']} style={styles.container}>
//       <Text style={styles.title}>Book Appointment in Seconds</Text>
//       <LinearGradient
//  colors={['rgba(255,255,255,0.2)', '#8A8DFF', 'rgba(255,255,255,0.2)']}

//   start={{ x: 0, y: 0 }}
//   end={{ x: 1, y: 0 }}
//   style={styles.headingLine}
// />

//       <Text style={styles.subtitle}>
//         Find the right doctor and schedule appointments with ease.
//       </Text>

//     <LinearGradient
//   colors={['rgba(255,255,255,0.2)', '#8A8DFF']}
//    start={{ x: 0.5, y: 0 }}
//   end={{ x: 0.5, y: 1 }}
//   style={styles.imageBorder}
// >
//   <View style={styles.imageWrapper}>
//     <Image
//       source={require('../../assets/doctor.png')}
//       style={styles.image}
//       resizeMode="cover"
//     />
//   </View>
// </LinearGradient>


//       <TouchableOpacity style={styles.button}>
//         <LinearGradient
//           colors={['rgba(255,255,255,0.2)', '#8A8DFF', 'rgba(255,255,255,0.2)']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.gradientButton}
//         >
//           <Text style={styles.buttonText}>Continue</Text>
//         </LinearGradient>
//       </TouchableOpacity>

//       <View style={styles.pagination}>
//         <View style={styles.dot} />
//         <View style={styles.dot} />
//         <View style={[styles.dot, styles.activeDot]} />
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     paddingTop: 80,
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   headingLine: {
//   width: 250,
//   height: 3,
//   borderRadius: 2,
//   marginTop: 6,
//   marginBottom: 16,
// },

//   subtitle: {
//     width:'80%',
//     lineHeight:22,
//     fontSize: 16,
//     color: '#5e5e5e',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
// imageBorder: {
//   padding: 20, // this creates the border thickness

//   marginBottom: 40,
// },

// imageWrapper: {

//   overflow: 'hidden',
//   backgroundColor:'white'
// },
//   image: {
//     width: width * 0.6,
//     height: width * 0.9,
//   },
//   button: {
//     width: width * 0.9,
//     borderRadius: 5,
//     overflow: 'hidden',
//     marginBottom: 30,
//   },
//   gradientButton: {
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   pagination: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     backgroundColor: '#c1c1c1',
//     borderRadius: 4,
//   },
//   activeDot: {
//     backgroundColor: '#8A8DFF',
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//   },
// });

// export default SplashScreen;
