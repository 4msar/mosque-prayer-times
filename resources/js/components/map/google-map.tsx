import { useGetNearByPlaces } from '@/hooks';
import { useLocationStore, useMosqueStore } from '@/store';
import { AdvancedMarker, Map, MapMouseEvent, Pin, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useMemo } from 'react';

export const GoogleMap = () => {
    const mapLib = useMapsLibrary('maps');

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

    return (
        <Map
            defaultCenter={{
                lat: currentLocation?.latitude || 0,
                lng: currentLocation?.longitude || 0,
            }}
            defaultZoom={16}
            onClick={handleMapClick}
            mapId={'8883d749fdf0e73d'}
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

            {mosques.map((item, index) => (
                <AdvancedMarker key={index} title={item.displayName} position={item.location} onClick={() => setSelected(item)}>
                    <Pin background="#0d9488" glyphColor="#2dd4bf" borderColor={selected?.id === item.id ? '#d1fae5' : '#064e3b'} />
                </AdvancedMarker>
            ))}
        </Map>
    );
};
