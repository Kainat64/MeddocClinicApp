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

const {width} = Dimensions.get('window');

const ProfileScreen = ({navigation}) => {
  const [doctor, setDoctor] = useState([]);
  const [review, setReview] = useState(0);
  const {logout, user} = useAuth();
  useEffect(() => {
    fetchDoctor();
  }, []);

  // const fetchDoctor = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('userToken');
  //     const response = await axios.get(`${BaseUrl}/get-doctor-app-profile`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setDoctor(response.data);
  //     setReview(response.data.reviews.length);
  //     console.log('rev count', review);
  //     console.log('doctor:', response.data);
  //   } catch (error) {
  //     console.error('Error fetching doctor:', error);
  //   }
  // };
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
  const DoctorProfile = () => {
    return (
      <LinearGradient
        colors={['#f5f7fa', '#e4e8f0']}
        style={styles.gradientContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <FontAwesome name="chevron-left" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileContainer}>
            {/* Profile Image with Glow Effect */}
            <View style={styles.imageGlowContainer}>
              <Image
                source={{
                  uri: doctor.image_url
                    ? doctor.image_url
                    : 'https://via.placeholder.com/100',
                }}
                style={styles.profileImage}
              />
            </View>

            {/* Name with Typography Hierarchy */}
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>
                {doctor.first_name} {doctor.last_name}
              </Text>
              <Text style={styles.specialtyText}>
                {doctor.specialist?.title || 'General Practitioner'}
              </Text>
            </View>

            {/* Stats Cards with Glass Morphism */}
            <View style={styles.cardContainer}>
              <View
                style={[
                  styles.card,
                  styles.cardGlow,
                  {borderColor: '#5e72e4'},
                ]}>
                <View style={styles.cardIconContainer}>
                  <FontAwesome name="users" size={20} color="#5e72e4" />
                </View>
                <Text style={styles.cardTitle}>Patients</Text>
                <Text style={styles.cardValue}>
                  {doctor.total_patients || 0}
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  styles.cardGlow,
                  {borderColor: '#11cdef'},
                ]}>
                <View style={styles.cardIconContainer}>
                  <FontAwesome name="star" size={20} color="#11cdef" />
                </View>
                <Text style={styles.cardTitle}>Reviews</Text>
                <Text style={styles.cardValue}>{review || 0}</Text>
              </View>

              <View
                style={[
                  styles.card,
                  styles.cardGlow,
                  {borderColor: '#2dce89'},
                ]}>
                <View style={styles.cardIconContainer}>
                  <FontAwesome name="briefcase" size={20} color="#2dce89" />
                </View>
                <Text style={styles.cardTitle}>Experience</Text>
                <Text style={styles.cardValue}>
                  {doctor.experience || '5+'} yrs
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  styles.cardGlow,
                  {borderColor: '#f5365c'},
                ]}>
                <View style={styles.cardIconContainer}>
                  <FontAwesome name="stethoscope" size={20} color="#f5365c" />
                </View>
                <Text style={styles.cardTitle}>Specialty</Text>
                <Text style={styles.cardValue}>
                  {doctor.specialist?.title || 'General'}
                </Text>
              </View>
            </View>

            {/* About Section */}
            <View
              style={[
                styles.sectionContainer,
                styles.aboutContainer,
                {borderColor: '#5e72e4'},
              ]}>
              <Text style={[styles.sectionTitle, {color: '#5e72e4'}]}>
                About Me
              </Text>
              <Text style={styles.aboutText}>
                {doctor.bio ||
                  `Dr. ${doctor.first_name} ${
                    doctor.last_name
                  } is a dedicated physician with over ${
                    doctor.experience || '5'
                  } years of experience in providing exceptional care. Being a premium doctor, you can book your appointments any time.`}
              </Text>
            </View>

            {/* Reviews Section */}
            <View
              style={[
                styles.sectionContainer,
                styles.reviewsContainer,
                {borderColor: '#11cdef'},
              ]}>
              <Text style={[styles.sectionTitle, {color: '#11cdef'}]}>
                Patient Reviews
              </Text>
              {doctor.reviews && doctor.reviews.length > 0 ? (
                doctor.reviews.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.reviewCard, {borderBottomColor: '#e9ecef'}]}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>
                        {item.user.name || 'Anonymous'}
                      </Text>
                      <View style={styles.ratingContainer}>
                        {Array.from({length: item.rating || 0}).map((_, i) => (
                          <FontAwesome
                            key={i}
                            name="star"
                            size={14}
                            color="#FFD700"
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewText}>
                      {item.comments || 'No comment provided.'}
                    </Text>
                    <Text style={styles.reviewDate}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.noReviewsContainer}>
                  <FontAwesome name="comment-o" size={40} color="#c9c9c9" />
                  <Text style={styles.noReviewsText}>No reviews yet</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  };
  const HospitalProfile = () => {
    return (
      <LinearGradient
        colors={['#f5f7fa', '#e4e8f0']}
        style={styles.gradientContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <FontAwesome name="chevron-left" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileContainer}>
            {/* Profile Image with Glow Effect */}
            <View style={styles.imageGlowContainer}>
              <Image
                source={{
                  uri: doctor.image_url
                    ? doctor.image_url
                    : 'https://via.placeholder.com/100',
                }}
                style={styles.profileImage}
              />
            </View>

            {/* Name with Typography Hierarchy */}
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>
                {doctor.hospital_name}
              </Text>
              
            </View>

            {/* Stats Cards with Glass Morphism */}
            <View style={styles.cardContainer}>
              <View
                style={[
                  styles.card,
                  styles.cardGlow,
                  {borderColor: '#5e72e4'},
                ]}>
                <View style={styles.cardIconContainer}>
                  <FontAwesome name="users" size={20} color="#5e72e4" />
                </View>
                <Text style={styles.cardTitle}>Patients</Text>
                <Text style={styles.cardValue}>
                  {doctor.total_patients || 0}
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  styles.cardGlow,
                  {borderColor: '#11cdef'},
                ]}>
                <View style={styles.cardIconContainer}>
                  <FontAwesome name="star" size={20} color="#11cdef" />
                </View>
                <Text style={styles.cardTitle}>Reviews</Text>
                <Text style={styles.cardValue}>{review || 0}</Text>
              </View>

            

           
            </View>

            {/* About Section */}
            <View
              style={[
                styles.sectionContainer,
                styles.aboutContainer,
                {borderColor: '#5e72e4'},
              ]}>
              <Text style={[styles.sectionTitle, {color: '#5e72e4'}]}>
                Hospital Details
              </Text>
              <Text style={styles.aboutText}>
              {doctor.detail || 'No description available'}
              </Text>
              <Text style={[styles.addressText, {color: '#5e72e4'}]}>
              Address
              </Text>
              <Text style={styles.aboutText}>
              {doctor.google_address || 'No description available'}
              </Text>
              <Text style={[styles.addressText, {color: '#5e72e4'}]}>
                Contact Number
              </Text>
              <Text style={styles.aboutText}>
              {doctor.phone || 'No description available'}
              </Text>
              <Text style={[styles.addressText, {color: '#5e72e4'}]}>
                Email
              </Text>
              <Text style={styles.aboutText}>
              {doctor.email || 'No description available'}
              </Text>
            </View>

            
          </View>
        </ScrollView>
      </LinearGradient>
    );
  };
  return (
    <>
    {user?.type === 'doctor' ? (
      <DoctorProfile />
    ) : user?.type === 'hospital' ? (
      <HospitalProfile />
    ) : null}
  </>
  
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#274A8A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#5e72e4',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  backButton: {
    padding: 8,
  },
  profileContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  imageGlowContainer: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    backgroundColor: 'rgba(94, 114, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -width * 0.1,
    shadowColor: '#5e72e4',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    borderWidth: 2,
    borderColor: '#5e72e4',
  },
  profileImage: {
    width: width * 0.38,
    height: width * 0.38,
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
    color: '#666',
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
    fontSize: 14,
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
  }
});

export default ProfileScreen;
