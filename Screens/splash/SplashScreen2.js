// import * as React from 'react';
// import {
//   View,
//   Text,
//   ImageBackground,
//   Image,
//   Animated,
//   Easing,
//   Dimensions,
//   TouchableOpacity,
//   StyleSheet
// } from 'react-native';

// const {width, height} = Dimensions.get('window');

// function SplashScreen2({navigation}) {
//   // Animation values
//   const fadeAnim = React.useRef(new Animated.Value(0)).current;
//   const slideAnim = React.useRef(new Animated.Value(30)).current;
//   const rotateAnim = React.useRef(new Animated.Value(0)).current;

//   React.useEffect(() => {
//     // Start animations when component mounts
//     Animated.parallel([
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
//       Animated.loop(
//         Animated.timing(rotateAnim, {
//           toValue: 1,
//           duration: 15000,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         })
//       ).start()
//     ]).start();

//     const timer = setTimeout(() => {
//       navigation.navigate('Login');
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, []);

//   const rotateInterpolate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg']
//   });

//   // Create dots around the circle
//   const renderDots = () => {
//     const dots = [];
//     const dotCount = 12;
//     const radius = 180;
    
//     for (let i = 0; i < dotCount; i++) {
//       const angle = (i * (2 * Math.PI)) / dotCount;
//       const x = radius * Math.cos(angle);
//       const y = radius * Math.sin(angle);
      
//       dots.push(
//         <View 
//           key={i}
//           style={[
//             styles.dot,
//             {
//               left: x + 200 - 5, // Adjusted positioning
//               top: y + 200 - 5,  // Adjusted positioning
//               backgroundColor: i % 2 === 0 ? '#4a6fdc' : '#274A8A',
//               opacity: 0.7
//             }
//           ]}
//         />
//       );
//     }
//     return dots;
//   };

//   return (
//     <ImageBackground
//       source={require('../../assets/images/app_background.png')}
//       style={styles.background}>
      
//       <View style={styles.topContainer}>
//         <View style={styles.logoContainer}>
//           <Image
//             source={require('../../assets/images/logo.png')}
//             style={styles.logo}
//           />
//         </View>

//         <View style={styles.circleContainer}>
//           <Animated.View style={[styles.dotsContainer, {transform: [{rotate: rotateInterpolate}]}]}>
//             {renderDots()}
//           </Animated.View>
          
//           <View style={styles.circle}>
//             <Image
//               source={require('../../assets/images/doctor_img.png')}
//               style={styles.doctorImage}
//             />
//           </View>
//         </View>

//         <View style={styles.textContainer}>
//           <Animated.Text
//             style={[
//               styles.welcomeText,
//               {
//                 opacity: fadeAnim,
//                 transform: [{translateY: slideAnim}],
//               },
//             ]}>
//             Doctor 365
//           </Animated.Text>
          
//           <Animated.Text
//             style={[
//               styles.subText,
//               {
//                 opacity: fadeAnim,
//                 transform: [{translateY: slideAnim}],
//               },
//             ]}>
//             Your Health, Our Priority
//           </Animated.Text>
          
//           <Animated.Text
//             style={[
//               styles.subText,
//               {
//                 opacity: fadeAnim,
//                 transform: [{translateY: slideAnim}],
//               },
//             ]}>
//             Always Here for You
//           </Animated.Text>
//         </View>
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('Login')}
//           style={styles.button}>
//           <Text style={styles.buttonText}>Get Started</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     justifyContent: 'space-between',
//   },
//   topContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   logoContainer: {
//     marginTop: 20,
//   },
//   logo: {
//     width: 220,
//     height: 110,
//     resizeMode: 'contain',
//   },
//   circleContainer: {
//     width: 400,
//     height: 400,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//     marginVertical: 20,
//   },
//   dotsContainer: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//   },
//   dot: {
//     position: 'absolute',
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   circle: {
//     width: 280,
//     height: 280,
//     borderRadius: 140,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#274A8A',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 20,
//     elevation: 10,
//     overflow: 'hidden',
//   },
//   doctorImage: {
//     width: '90%',
//     height: '90%',
//     resizeMode: 'contain',
//   },
//   textContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//     paddingHorizontal: 20,
//   },
//   welcomeText: {
//     fontSize: 36,
//     fontWeight: '700',
//     color: '#274A8A',
//     marginBottom: 15,
//     textShadowColor: 'rgba(0,0,0,0.05)',
//     textShadowOffset: {width: 1, height: 1},
//     textShadowRadius: 2,
//   },
//   subText: {
//     fontSize: 22,
//     fontWeight: '500',
//     color: '#333',
//     marginVertical: 5,
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     width: '100%',
//     padding: 20,
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#274A8A',
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     letterSpacing: 1,
//   },
// });

// export default SplashScreen2;


import React from 'react';
import SplashSlide from './SharedComponent';

const slide = {
  title: 'Consult From Anywhere',
  description: 'Video call with licensed medical professionals right from your phone.',
  image: require('../../assets/images/consultDoc.jpg'),
  buttonColor: '#008080',
};

export default function Splash1({ navigation }) {
  return (
    <SplashSlide
      navigation={navigation}
      slide={slide}
       currentIndex={0}
      totalSlides={2}
      onContinue={() => navigation.replace('Splash3')}
    />
  );
}
