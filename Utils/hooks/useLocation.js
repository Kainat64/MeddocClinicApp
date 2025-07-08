import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import GetLocation from 'react-native-get-location';
import { getSetting } from '../SettingsService';

const useLocation = () => {
  const [cityName, setCityName] = useState('');
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });

        const { latitude, longitude } = location;
        getCityNameFromCoords(latitude, longitude);
      } catch (error) {
        setCityName('Location unavailable');
        setLocationError(error.message);
      }
    };

    const getCityNameFromCoords = async (latitude, longitude) => {
      try {
        const API_KEY =
          Platform.OS === 'android'
            ? getSetting('android_sdk_api_key')
            : getSetting('ios_sdk_api_key');

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.results.length > 0) {
          const city =
            data.results[0].address_components.find((c) =>
              c.types.includes('locality')
            )?.long_name;
          setCityName(city || 'City not found');
        } else {
          setCityName('City not found');
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setLocationError('Failed to fetch city');
      }
    };

    getCurrentLocation();
  }, []);

  return { cityName, locationError };
};

export default useLocation;
