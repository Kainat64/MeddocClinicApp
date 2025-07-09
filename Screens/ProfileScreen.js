import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BaseUrl} from '../Utils/BaseApi';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../Components/AuthContext';
import {Color} from '../GlobalStyles';
const {width} = Dimensions.get('window');
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TextInput } from 'react-native-gesture-handler';
import {launchImageLibrary} from 'react-native-image-picker';


const ProfileScreen = ({navigation}) => {
  const [doctor, setDoctor] = useState([]);
  const [startTime, setStartTime] = useState(doctor.start_time || '');
const [endTime, setEndTime] = useState(doctor.end_time || '');

const [isStartPickerVisible, setStartPickerVisible] = useState(false);
const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const [review, setReview] = useState(0);
  const {logout, user} = useAuth();
  useEffect(() => {
    fetchDoctor();
  }, []);
const handleConfirmStart = (date) => {
  const time = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  setStartTime(time);
  setStartPickerVisible(false);
};

const handleConfirmEnd = (date) => {
  const time = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  setEndTime(time);
  setEndPickerVisible(false);
};
const handleSelectImage = async () => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setDoctor(prev => ({...prev, image_url: uri}));
    }
  } catch (error) {
    console.error('Image picker error:', error);
  }
};




console.log('ImagePicker lib', launchImageLibrary);


  const fetchDoctor = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      let endpoint = '';
      if (user?.type === 'doctor') {
        endpoint = '/get-doctor-app-profile';
      } else if (user?.type === 'hospital') {
        endpoint = '/get-hospitals-profile';
      }
      const response = await axios.get(`${BaseUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Handle array response for hospital
      const data = user?.type === 'hospital' ? response.data[0] : response.data;
      
      setDoctor(data);
      console.log('Hospital fetch', data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
const handleUpdateProfile = async () => {
  
  
};
  
  

  return (
    <LinearGradient
      colors={['#f5f7fa', '#e4e8f0']}
      style={styles.gradientContainer}>
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
  <View style={styles.backCircle}>
    <FontAwesome name="chevron-left" size={16} color="#fff" />
  </View>
</TouchableOpacity>


        <View style={styles.profileContainer}>
<View style={styles.imageWrapper}>
  <Image
    source={{
      uri: doctor.image_url
        ? doctor.image_url
        : 'https://via.placeholder.com/100',
    }}
    style={styles.profileImage}
  />
  <TouchableOpacity onPress={handleSelectImage} style={styles.editIconWrapper}>
    <FontAwesome name="pencil" size={16} color="white" />
  </TouchableOpacity>
</View>


          <Text style={styles.nameText}>{doctor.hospital_name || 'Hospital Name'}</Text>

          {/* Stats: Patients / Reviews */}
          <View style={styles.statsRow}>
            <View style={styles.statsCard}>
                <View style={styles.backCircle}>
              <FontAwesome name="users" size={16} color="white" /></View>
              <Text style={styles.statsLabel}>Patients</Text>
              <Text style={styles.statsValue}>{doctor.total_patients || 0}</Text>
            </View>
            <View style={styles.statsCard}>
              <View style={styles.backCircle}>
              <FontAwesome name="star" size={20} color="white" /></View>
              <Text style={styles.statsLabel}>Reviews</Text>
              <Text style={styles.statsValue}>{review || 0}</Text>
            </View>
          </View>

          {/* Clinic Detail Section */}
       {/* Clinic Detail Section */}
<View style={styles.detailCard}>
  <Text style={styles.detailTitle}>Hospital Detail</Text>


  <Text style={styles.detailLabel}>Description</Text>
  <TextInput
    style={[styles.detailField, { height: 'auto', textAlignVertical: 'top' }]}
    value={doctor.detail}
    onChangeText={(text) => setDoctor({...doctor, detail: text})}
    placeholder="Clinic Description"
    multiline
  />

  <Text style={styles.detailLabel}>Address</Text>
  <TextInput
  style={[styles.detailField, { height: 'auto', textAlignVertical: 'top' }]}
    value={doctor.google_address}
    onChangeText={(text) => setDoctor({...doctor, google_address: text})}
    placeholder="Address"
    multiline
  />

  <Text style={styles.detailLabel}>Phone</Text>
  <TextInput
    style={styles.detailField}
    value={doctor.phone}
    onChangeText={(text) => setDoctor({...doctor, phone: text})}
    placeholder="Phone"
    keyboardType="phone-pad"
  />

  <Text style={styles.detailLabel}>Email</Text>
  <TextInput
    style={styles.detailField}
    value={doctor.email}
    onChangeText={(text) => setDoctor({...doctor, email: text})}
    placeholder="Email"
    keyboardType="email-address"
  />

  <View style={styles.timeRow}>
    <View style={{flex: 1}}>
      <Text style={styles.timeLabel}>Start Time</Text>
      <TouchableOpacity onPress={() => setStartPickerVisible(true)}>
        <Text style={styles.timeBox}>{startTime || '10:00am'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="time"
        onConfirm={handleConfirmStart}
        onCancel={() => setStartPickerVisible(false)}
      />
    </View>
    <View style={{flex: 1}}>
      <Text style={styles.timeLabel}>End Time</Text>
      <TouchableOpacity style={styles.time} onPress={() => setEndPickerVisible(true)}>
        <Text style={styles.timeBox}>{endTime || '10:00pm'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="time"
        onConfirm={handleConfirmEnd}
        onCancel={() => setEndPickerVisible(false)}
      />
    </View>
  </View>

  {/* Update Button */}
  <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
    <Text style={styles.updateButtonText}>Update Profile</Text>
  </TouchableOpacity>
</View>

        </View>
      </ScrollView>
    </LinearGradient>
  );
};



const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },

backCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: Color.blue1, // red background
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 4,
},

  backButton: {
    padding: 8,
  },
  profileContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  
  },
  imageWrapper: {
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
},

editIconWrapper: {
  position: 'absolute',
  bottom: 5,
  right: 5,
  backgroundColor: 'rgba(0,0,0,0.6)',
  borderRadius: 20,
  padding: 6,
},


  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.38) / 2,
    borderWidth: 4,
    borderColor: '#42b883',
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: Color.blue1,
    fontFamily: 'sans-serif-medium',
  },
  specialtyText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 5,
    fontWeight: '500',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '90%',
  },
  card: {
    width: width * 0.42,
    marginBottom: 15,
    padding: 18,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    borderWidth: 2,
  },
  cardGlow: {
    shadowColor: '#5e72e4',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(94, 114, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
  },
  sectionContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
    paddingBottom: 10,
  },
  aboutText: {
    fontSize: 18,
    color: '#4a5568',
    lineHeight: 22,
  },
  reviewCard: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3748',
  },
  reviewText: {
    fontSize: 13,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: '#a0aec0',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  noReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noReviewsText: {
    fontSize: 14,
    color: '#a0aec0',
    marginTop: 10,
  },
  addressText:{
    paddingTop:10,
fontWeight:700
  },
  statsRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginVertical: 40,
  width: '90%',
},

statsCard: {
  backgroundColor: '#fff',
  width: '45%',
  alignItems: 'center',
  paddingVertical: 16,
  borderRadius: 12,
  borderWidth:1,
  borderColor: Color.blue1,
  elevation: 7,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
},

statsLabel: {
  marginTop: 6,
  color: '#555',
  fontSize: 14,
},

statsValue: {
  fontWeight: 'bold',
  fontSize: 18,
  marginTop: 4,
  color: Color.blue1,
},

detailCard: {
  width: '90%',
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 16,
  elevation: 5,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  marginBottom: 40,
},

detailTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 4,
  color: '#333',
},

detailDesc: {
  fontSize: 13,
  color: '#666',
  marginBottom: 16,
},

detailLabel: {
  fontSize: 13,
  fontWeight: '500',
  marginTop: 10,
  color: '#555',
},

detailField: {
  backgroundColor: '#eef0ff',
  padding: 10,
  borderRadius: 8,
  marginTop: 4,
  fontSize: 14,
  color: '#333',
},
timeLabel: {
  fontSize: 13,
  fontWeight: '500',
 
  textAlign: 'center',
  color: '#555',
},
timeRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 16,
  padding: 10,
  gap: 8,
},

timeBox: {
  margin: 10,
  backgroundColor: '#eef0ff',
  padding: 10,
  borderRadius: 8,
  textAlign: 'center',
  color: '#333',
  fontWeight:'bold',
  width: '90%'
},
updateButton: {
  marginTop: 20,
  backgroundColor: Color.blue1,
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
},
updateButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
editImageText: {
  marginTop: 8,
  textAlign: 'center',
  color: '#007bff',
  fontSize: 14,
},


});

export default ProfileScreen;
