import { useSettingsStore } from '@/store/settings-store';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export type Location = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
};

const getLocationFromIp = async (): Promise<Location | undefined> => {
  try {
    const ipRes = await fetch('https://ip.msar.me/details');
    if (!ipRes.ok) return undefined;

    const ipData = await ipRes.json();
    const city: string | undefined = ipData.city;
    const country: string | undefined = ipData.country;

    if (!city) return undefined;

    const query = country ? `${city}, ${country}` : city;
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!geoRes.ok) return undefined;

    const geoData = await geoRes.json();
    if (!geoData.length) return undefined;

    return {
      latitude: parseFloat(geoData[0].lat),
      longitude: parseFloat(geoData[0].lon),
    };
  } catch {
    return undefined;
  }
};

export const useGetLocation = () => {
  const [location, setLocation] = useState<Location>();
  const { setLocationFromMap } = useSettingsStore();

  const getLocation = useCallback((info = false) => {
    if (!('geolocation' in navigator)) {
      if (info) {
        toast.info(
          'Geolocation is not supported by your browser, trying to use IP address as fallback'
        );
      }
      getLocationFromIp().then((loc) => {
        if (loc) {
          setLocation(loc);
        } else {
          toast.error('Failed to get location, choose a location from the map');
          setLocationFromMap(true);
        }
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      async () => {
        if (info) {
          toast.info('Failed to get location, trying to use IP address as fallback');
        }
        const loc = await getLocationFromIp();
        if (loc) {
          setLocation(loc);
          if (info) {
            toast.success('Location found using IP address');
          }
        } else {
          toast.error('Failed to get location, choose a location from the map');
          setLocationFromMap(true);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { location, getLocation };
};
