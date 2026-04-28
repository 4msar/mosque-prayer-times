import {
    AdvancedMarker,
    Map,
    MapMouseEvent,
    Pin,
    useMap,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetLocation } from "@/hooks/use-location";
import { useGetNearByPlaces } from "@/hooks/use-nearby-places";
import { FloatingButton } from "@/components/floating-button";
const markerImage = "/marker.png";

export const defaultLocation = {
    latitude: 23.7706621,
    longitude: 90.3751423,
};

export const WebMaps = () => {
    const mapLib = useMapsLibrary("maps");
    const map = useMap();
    const navigate = useNavigate();
    const [_placeId, setPlaceId] = useState<string | null>(null);

    const currentLocation = useGetLocation();

    const center = useMemo(() => {
        if (!currentLocation || !mapLib)
            return {
                lat: defaultLocation.latitude,
                lng: defaultLocation.longitude,
            };

        return new google.maps.LatLng(
            currentLocation.latitude,
            currentLocation.longitude,
        );
    }, [currentLocation, mapLib]);

    const mosques = useGetNearByPlaces(currentLocation ?? null);

    const handleMapClick = (event: MapMouseEvent) => {
        if (!event.detail.latLng) return;

        if (event.detail.placeId) {
            setPlaceId(event.detail.placeId);
        }
    };

    const handleMosqueClick = (mosque: google.maps.places.Place) => {
        navigate(`/mosque/${mosque.id}`, {
            state: {
                name: mosque.displayName,
                address: mosque.formattedAddress,
                latitude: mosque.location?.lat(),
                longitude: mosque.location?.lng(),
            },
        });
    };

    const handleLocateMe = () => {
        if (!currentLocation) return;
        map?.setCenter({
            lat: currentLocation.latitude,
            lng: currentLocation.longitude,
        });
    };

    useEffect(() => {
        if (currentLocation) {
            map?.setCenter({
                lat: currentLocation.latitude,
                lng: currentLocation.longitude,
            });
        }
    }, [currentLocation, map]);

    return (
        <div className="relative h-full w-full">
            <Map
                defaultCenter={{
                    lat: defaultLocation.latitude,
                    lng: defaultLocation.longitude,
                }}
                defaultZoom={16}
                onClick={handleMapClick}
                mapId={"8883d749fdf0e73d"}
                className="h-full w-full"
            >
                {currentLocation && (
                    <AdvancedMarker position={center}>
                        <Pin
                            background="#38bdf8"
                            glyphColor="#082f49"
                            borderColor="#0c4a6e"
                        >
                            <span className="font-bold text-xs">You</span>
                        </Pin>
                    </AdvancedMarker>
                )}

                {mosques.map((item) => (
                    <AdvancedMarker
                        key={item.id}
                        title={item.displayName ?? undefined}
                        position={item.location}
                        onClick={() => handleMosqueClick(item)}
                    >
                        <img src={markerImage} width={40} height={40} alt={item.displayName ?? "mosque"} />
                    </AdvancedMarker>
                ))}
            </Map>
            <FloatingButton onClick={handleLocateMe} />
        </div>
    );
};
