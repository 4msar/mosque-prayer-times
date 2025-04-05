import { useLocationStore } from '@/store';

export const useGetLocation = () => {
    const { location, setLocation } = useLocationStore();

    if ('geolocation' in navigator) {
        /* geolocation IS available */
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                });
            },
            (error) => {
                console.log('Error getting location', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            },
        );
    } else {
        /* geolocation IS NOT available */
        console.error('Geolocation is not supported by this browser.');
    }

    return location;
};
