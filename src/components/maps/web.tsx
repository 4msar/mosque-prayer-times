import {
    AdvancedMarker,
    Map,
    type MapMouseEvent,
    Pin,
    useMap,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";
import { useGetLocation } from "@/hooks/use-location";
import { useGetNearByPlaces } from "@/hooks/use-nearby-places";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useSettingsStore } from "@/store/settings-store";
import { FloatingButton } from "@/components/floating-button";
import { MosqueDetailsOverlay } from "@/components/mosque-details-overlay";
import { WifiOff } from "lucide-react";

const markerImage = "/marker.png";

const defaultLocation = {
    latitude: 23.7706621,
    longitude: 90.3751423,
};

interface SelectedMosque {
    placeId: string;
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
}

export const WebMaps = () => {
    const mapLib = useMapsLibrary("maps");
    const map = useMap();
    const [selectedMosque, setSelectedMosque] = useState<SelectedMosque | null>(null);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const isOnline = useOnlineStatus();

    const currentLocation = useGetLocation();
    const { radius, darkMode } = useSettingsStore();

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

    const mosques = useGetNearByPlaces(currentLocation ?? null, radius);

    const handleMapClick = (event: MapMouseEvent) => {
        if (!event.detail.latLng) return;
        // Close overlay when clicking map background
        if (!event.detail.placeId) {
            setOverlayOpen(false);
        }
    };

    const handleMosqueClick = (mosque: google.maps.places.Place) => {
        setSelectedMosque({
            placeId: mosque.id,
            name: mosque.displayName ?? undefined,
            address: mosque.formattedAddress ?? undefined,
            latitude: mosque.location?.lat(),
            longitude: mosque.location?.lng(),
        });
        setOverlayOpen(true);
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

    if (!isOnline) {
        return (
            <div className="flex flex-1 h-full w-full flex-col items-center justify-center gap-4 bg-muted/40 text-muted-foreground">
                <WifiOff className="h-12 w-12 opacity-50" />
                <div className="text-center">
                    <p className="text-lg font-semibold">You are offline</p>
                    <p className="text-sm">Map requires an internet connection.</p>
                    <p className="text-sm">Please reconnect to view nearby mosques.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Map
                defaultCenter={{
                    lat: defaultLocation.latitude,
                    lng: defaultLocation.longitude,
                }}
                defaultZoom={16}
                onClick={handleMapClick}
                mapId={"8883d749fdf0e73d"}
                colorScheme={darkMode ? "DARK" : "LIGHT"}
                className="flex-1 h-full w-full"
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

            {selectedMosque && (
                <MosqueDetailsOverlay
                    open={overlayOpen}
                    onOpenChange={setOverlayOpen}
                    placeId={selectedMosque.placeId}
                    initialName={selectedMosque.name}
                    initialAddress={selectedMosque.address}
                    initialLatitude={selectedMosque.latitude}
                    initialLongitude={selectedMosque.longitude}
                />
            )}
        </>
    );
};
