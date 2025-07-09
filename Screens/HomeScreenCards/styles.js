import { Dimensions, Platform, StyleSheet } from "react-native";
const {width, height} = Dimensions.get('window');
import { Color } from '../../GlobalStyles';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
   topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#f95959',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileIcon: {
    padding: 4,
  },
  profileBadge: {
    backgroundColor: '#5585b5',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
   appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  appointmentHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentIcon: {
    backgroundColor: '#e8e8fa',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  appointmentTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  viewText: {
    color: '#5f5dbd',
    fontWeight: '500',
    fontSize: 14,
  },
  appointmentBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  doctorPic: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#d1d1f0',
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  doctorSpecialty: {
    fontSize: 12,
    color: '#6b7280',
  },
  videoButton: {
    backgroundColor: '#e8e8fa',
    padding: 10,
    borderRadius: 999,
  },
  seeAllText: {
    color: '#5f5dbd',
    fontSize: 14,
    fontWeight: '500',
    paddingRight:20,
  },  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 20,
    marginBottom: 12,
  }, servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    width: (width - 56) / 2,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconValueContainer: {
  flexDirection: 'row',
 justifyContent: 'space-between',
  marginBottom: 8,
gap:40,
  padding:10
},

  serviceIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
  fontSize: 28,
  fontWeight: 'bold',
  color: Color.blue1,
  marginBottom: 4,
},
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  logo: {
 
    width: 40,
    height: 40,
   
   
    borderRadius:35
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrapper: {
  backgroundColor:'white',
    marginRight: 12,
   padding:6,
   borderRadius:16
  },
    logoText: {},
  appName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appTagline: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  ProfileLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? 0 : 5,
     gap:30
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
   
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    backgroundColor: Color.blue1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  locationText: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  card: {
    width: '90%',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 5,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cardButtonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '48%',
  },
  cardButtonGradient: {
    borderRadius: 8,
    padding: 1,
  },
  cardButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  cardButtonWithdraw: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  upcomingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    color: Color.blue1,
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 5,
  },
  metricCard: {
    width: width * 0.43,
    height: 120,
    borderRadius: 12,
    padding: 15,
    justifyContent: 'space-between',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  metricIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  metricTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  eventsContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  flatListContainer: {
    paddingBottom: 10,
  },
  eventCardContainer: {
    width: 160,
    marginRight: 15,
  },
  eventCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },



  //Notification Modal
   modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationModal: {
    width: width * 0.85,
    maxHeight: height * 0.7,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  closedButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
    color: '#999',
  },
  notifyText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  notificationList: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
 
  noNotifications: {
    textAlign: 'center',
    color: '#9ca3af',
    fontStyle: 'italic',
    fontSize: 14,
    marginTop: 20,
  },
  notificationIcon: {
  position: 'relative',
paddingRight:20
},

notificationBadge: {
  position: 'absolute',
  right: 15,
  top: -5,
  backgroundColor: 'red',
  borderRadius: 10,
  width: 18,
  height: 18,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
},

notificationText: {
  color: '#666',
  alignItems: 'center',
  textAlign:'center',
  fontSize: 14,
  fontWeight: 'bold',
},

});
export default styles;
