import { useAppearance, useGetNearByPlaces } from '@/hooks';
import { useLocationStore, useMosqueStore } from '@/store';
import { AdvancedMarker, ColorScheme, Map, MapMouseEvent, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useMemo } from 'react';

export const GoogleMap = () => {
    const mapLib = useMapsLibrary('maps');
    const map = useMap();
    const { appearance } = useAppearance();

    const currentLocation = useLocationStore((state) => state.location);
    const selected = useMosqueStore((state) => state.mosque);
    const setLocation = useLocationStore((state) => state.setLocation);
    const setSelected = useMosqueStore((state) => state.setMosque);
    const setPlaceId = useMosqueStore((state) => state.setPlaceId);

    const center = useMemo(() => {
        if (!currentLocation || !mapLib) return { lat: 0, lng: 0 };

        return new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
    }, [currentLocation, mapLib]);

    const mosques = useGetNearByPlaces(currentLocation);

    const handleMapClick = (event: MapMouseEvent) => {
        console.log({ event });

        if (!event.detail.latLng) return;

        setLocation({
            latitude: event.detail.latLng.lat,
            longitude: event.detail.latLng.lng,
        });

        if (event.detail.placeId) {
            setPlaceId(event.detail.placeId);
        }
    };

    useEffect(() => {
        if (currentLocation) {
            map?.setCenter({
                lat: currentLocation.latitude,
                lng: currentLocation.longitude,
            });
        }
    }, [currentLocation, map]);

    const theme = useMemo<ColorScheme>(() => {
        if (appearance === 'dark') {
            return 'DARK';
        } else if (appearance === 'light') {
            return 'LIGHT';
        } else {
            return 'FOLLOW_SYSTEM';
        }
    }, [appearance]);

    return (
        <Map
            defaultCenter={{
                lat: currentLocation?.latitude || 0,
                lng: currentLocation?.longitude || 0,
            }}
            defaultZoom={16}
            onClick={handleMapClick}
            mapId={'8883d749fdf0e73d'}
            colorScheme={theme}
        >
            <AdvancedMarker position={center}>
                <Pin background="#38bdf8" glyphColor="#082f49" borderColor="#0c4a6e">
                    <span
                        style={{
                            fontWeight: 'bold',
                        }}
                    >
                        You
                    </span>
                </Pin>
            </AdvancedMarker>

            {mosques.map((item) => (
                <AdvancedMarker key={item.id} title={item.displayName} position={item.location} onClick={() => setSelected(item)}>
                    <Pin background={selected?.id === item.id ? '#2563eb' : '#0d9488'} glyphColor="#2dd4bf" borderColor="#064e3b" />
                </AdvancedMarker>
            ))}
        </Map>
    );
};
