import { useGetLocation } from "@/src/hooks/use-location";
import { useGetNearByPlaces } from "@/src/hooks/use-nearby-places";
import {
    AdvancedMarker,
    APIProvider,
    Map,
    MapMouseEvent,
    Pin,
    useMap,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";
import { FloatingButton } from "../floating-button";
import markerImage from "@/assets/marker.png";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types";

export const defaultLocation = {
    // Bangladesh
    latitude: 23.7706621,
    longitude: 90.3751423,
};

export const WebMaps = () => {
    const mapLib = useMapsLibrary("maps");
    const map = useMap();
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [placeId, setPlaceId] = useState<string | null>(null);

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

    const mosques = useGetNearByPlaces(currentLocation);

    const handleMapClick = (event: MapMouseEvent) => {
        console.log({ event });

        if (!event.detail.latLng) return;

        // setLocation({
        //     latitude: event.detail.latLng.lat,
        //     longitude: event.detail.latLng.lng,
        // });

        if (event.detail.placeId) {
            setPlaceId(event.detail.placeId);

            // navigation.navigate("MosqueDetails", {
            //     placeId: mosque.place_id,
            //     name: mosque.name,
            //     address: mosque.vicinity,
            //     latitude: mosque.geometry.location.lat,
            //     longitude: mosque.geometry.location.lng,
            // });
        }
    };

    const handleMosqueClick = (mosque: any) => {
        console.log({ mosque });
        // return;
        navigation.navigate("MosqueDetails", {
            placeId: mosque.id,
            name: mosque.displayName,
            address: mosque.formattedAddress,
            latitude: mosque.location.lat(),
            longitude: mosque.location.lng(),
        });
    };

    const handleButtonClick = () => {
        console.log({ currentLocation, map });
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
        <>
            <Map
                defaultCenter={{
                    lat: currentLocation?.latitude || 0,
                    lng: currentLocation?.longitude || 0,
                }}
                defaultZoom={16}
                onClick={handleMapClick}
                mapId={"8883d749fdf0e73d"}
                // colorScheme={theme}
            >
                <AdvancedMarker position={center}>
                    <Pin
                        background="#38bdf8"
                        glyphColor="#082f49"
                        borderColor="#0c4a6e"
                    >
                        <span
                            style={{
                                fontWeight: "bold",
                            }}
                        >
                            You
                        </span>
                    </Pin>
                </AdvancedMarker>

                {mosques.map((item) => (
                    <AdvancedMarker
                        key={item.id}
                        title={item.displayName}
                        position={item.location}
                        onClick={() => handleMosqueClick(item)}
                    >
                        {/* <Pin
                            // background={
                            //     selected?.id === item.id ? "#2563eb" : "#0d9488"
                            // }
                            glyphColor="#2dd4bf"
                            borderColor="#064e3b"
                        /> */}
                        <img src={markerImage} width={48} height={48} />
                    </AdvancedMarker>
                ))}
            </Map>
            <FloatingButton onPress={handleButtonClick} />
        </>
    );
};
