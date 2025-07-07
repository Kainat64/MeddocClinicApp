import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../Components/AuthContext';
import { FontFamily, Color, Padding, Border, FontSize } from '../../GlobalStyles';
const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/app_background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('Splash3')}
          >
            <FontAwesome name="arrow-left" size={20} color="#333" />
            <Text style={styles.backText}> Back</Text>
          </TouchableOpacity>

           <View style={styles.logoRow}>
    <Image
      style={styles.logo}
      source={require('../../assets/images/logoo.png')}
    />
    <Text style={styles.text_header}>MEDDOC</Text>
  </View>

          <View style={styles.formContainer}>
            <Text style={styles.text_header}>Welcome Back</Text>
            <Text style={styles.subtitle}>Please login to your account</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <FontAwesome 
                name="envelope" 
                size={18} 
                color="#420475" 
                style={styles.icon} 
              />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#A0A0A0"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <FontAwesome 
                name="lock" 
                size={20} 
                color="#420475" 
                style={styles.icon} 
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            
            {/* Login Button */}
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
   
    paddingHorizontal: 25,
  },
  container: {
    flex: 1,
  },
  backButton: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    color:'#333',
  },
   logoContainer: {
    marginBottom:50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    marginTop:80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap:10
  },


 logo: {
    width: 60,
    height: 60,
    borderRadius: 55,
  },
 loginContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
   
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  text_header: {
    color: '#420475',
    fontWeight: 'bold',
    fontSize: 28,
   
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#234A85',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#234A85',
  },
 loginButton: {
    backgroundColor: Color.blue1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#420475',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,evation: 3,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 20,
  },
  forgotText: {
    color: '#420475',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;