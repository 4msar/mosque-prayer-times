import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      getLocationFromIp().then((loc) => {
        if (loc) setLocation(loc);
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
        const loc = await getLocationFromIp();
        if (loc) setLocation(loc);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  return location;
};
