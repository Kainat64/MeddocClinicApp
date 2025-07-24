import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import GetLocation from 'react-native-get-location';
import { fetchAppSettings, getSetting } from '../SettingsService';

const useLocation = () => {
  const [cityName, setCityName] = useState('');
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Wait for settings to load
        await fetchAppSettings();

        // Now it's safe to get the API key
        const googleMapsApiKey = Platform.OS === 'android'
          ? getSetting('android_sdk_api_key')
          : getSetting('ios_sdk_api_key');

        if (!googleMapsApiKey) {
          console.warn('Google Maps API key is missing');
          setLocationError('API key missing');
          return;
        }

        // Get current location
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 60000,
        });

        const { latitude, longitude } = location;

        // Call reverse geocoding
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        console.log("Google Maps API response", data);

        if (data.results.length > 0) {
          const cityComponent = data.results[0].address_components.find(component =>
            component.types.includes('locality')
          );
          if (cityComponent) {
            setCityName(cityComponent.long_name);
            console.log("City name:", cityComponent.long_name);
          } else {
            setCityName('City not found');
          }
        } else {
          setCityName('City not found');
        }

      } catch (error) {
        console.error('Error getting location:', error);
        setLocationError(error.message);
      }
    };

    init();
  }, []);

  return { cityName, locationError };
};

export default useLocation;
