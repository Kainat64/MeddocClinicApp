import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../../Components/AuthContext';
import {BaseUrl} from '../../Utils/BaseApi';
import axios from 'axios';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width} = Dimensions.get('window');
const WidthdrawScreen = ({navigation}) => {
  const {user} = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWalletBalance();
  }, []);
  const fetchWalletBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BaseUrl}/wallet-balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //const balanceData = await response.json();
     
      setWalletBalance(parseFloat(response.data.balance).toFixed(2));
      console.log('Wallet Balance:', response.data.balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);

    // Validation: Check if the amount is a valid positive number
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }

    // Validation: Check if the amount exceeds the wallet balance
    if (amount > walletBalance) {
      Alert.alert(
        'Insufficient Balance',
        'The withdrawal amount exceeds your wallet balance. Please enter a valid amount.',
      );
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${BaseUrl}/withdraw-request`,
        {amount},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Withdraw Response:', response.data);
      setIsLoading(false);
      Alert.alert('Request Sent Successfully');
      fetchWalletBalance(); // Refresh wallet balance after successful withdrawal
    } catch (error) {
      console.error('Error withdrawing:', error);
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.wallet}>
        <Text style={styles.walletText}>Wallet Balance:</Text>
        <Text style={styles.walletText}> {walletBalance}</Text>
      </View>
      <View styles={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={withdrawAmount}
          onChangeText={setWithdrawAmount}
        />
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleWithdraw}
          disabled={isLoading || !withdrawAmount}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setIsModalVisible(false)}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  wallet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 15,
    backgroundColor: '#274A8A',
    width: '100%',
    border: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },
  walletText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 10,
    alignItems: 'center',
    textAlign: 'center',
  },
  content: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    marginTop: 10,
    borderColor: '#274A8A',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: '#222831',
  },
  confirmButton: {
    backgroundColor: '#274A8A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 18,
  },
});

export default WidthdrawScreen;
