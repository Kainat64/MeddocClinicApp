// // HomeScreen.js
// import * as React from 'react';
// import { View, Text, Button,ImageBackground } from 'react-native';
// import { StyleSheet } from 'react-native';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     fontSize: 20,
//   },
//   button: {
//     marginTop: 20,
//     width:300,
//   },
//   background: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height:'auto',
//   },
// });
// function SplashScreen3({ navigation }) {
//   React.useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.navigate('Splash4');
//     }, 3000); // 3000 milliseconds = 3 seconds
//     return () => clearTimeout(timer); // Cleanup the timer on component unmount
//   }, [navigation]);
//   return (
//     <>
    
//     <ImageBackground 
//       source={require('../../assets/images/splash_screen3.png')} 
//       style={styles.background}
//     >
      
//     </ImageBackground>
//     </>
  
//   );
// }

// export default SplashScreen3;


import React from 'react';
import SplashSlide from './SharedComponent';
const slide = {

    title: 'Book Appointments in Seconds',
  description: 'Find the right doctor and schedule appointments with ease.',
  image: require('../../assets/images/book.jpg'),
  buttonColor: '#007BFF',
};

export default function Splash2({ navigation }) {
  return (
    <SplashSlide
      navigation={navigation}
      slide={slide}
      currentIndex={1}
      totalSlides={2}
      onContinue={() => navigation.replace('Login')}
      onBack={() => navigation.replace('Splash2')}
    />
  );
}
