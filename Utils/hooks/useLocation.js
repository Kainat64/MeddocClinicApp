import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import GetLocation from 'react-native-get-location';
import { getSetting } from '../SettingsService';

const useLocation = () => {
  const [cityName, setCityName] = useState('');
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        const { latitude, longitude } = location;
        getCityNameFromCoords(latitude, longitude);
      })
      .catch(error => {
        console.warn(error.code, error.message);
      });
  };

   const googleMapsApiKey = Platform.OS === 'android'
  ? getSetting('android_sdk_api_key')
  : getSetting('ios_sdk_api_key');
  const getCityNameFromCoords = async (latitude, longitude) => {
const API_KEY = googleMapsApiKey;

 console.log(" API key",API_KEY )
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Google Maps API response", data);
      if (data.results.length > 0) {
        const cityName = data.results[0].address_components.find(component =>
          component.types.includes('locality'),
        ).long_name;
        setCityName(cityName);
         console.log("give me city name", cityName)
      } else {
        setCityName('City not found');
      }
     
    } catch (error) {
      console.error('Error in reverse geocoding: ', error);
    }
  };

    getCurrentLocation();
  }, []);

  return { cityName, locationError };
};

export default useLocation;
