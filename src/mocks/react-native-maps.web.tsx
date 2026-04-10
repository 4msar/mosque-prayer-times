/**
 * Web implementation of react-native-maps using @vis.gl/react-google-maps.
 * Provides drop-in compatible MapView, Marker, and other primitives for web builds.
 */
import React, { forwardRef, useState } from "react";
import { View, Image } from "react-native";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    InfoWindow,
    Pin,
    useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

export const PROVIDER_GOOGLE = "google";
export const PROVIDER_DEFAULT = null;

export const Callout = (_props: any) => null;
export const Polyline = (_props: any) => null;
export const Polygon = (_props: any) => null;
export const Circle = (_props: any) => null;

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

function deltaToZoom(latitudeDelta: number): number {
    return Math.round(Math.log2(360 / latitudeDelta));
}

interface MarkerProps {
    coordinate: { latitude: number; longitude: number };
    title?: string;
    description?: string;
    onCalloutPress?: () => void;
    image?: any;
    pinColor?: string;
    children?: React.ReactNode;
    [key: string]: any;
}

export const Marker = ({
    coordinate,
    title,
    description,
    onCalloutPress,
    image,
    pinColor,
}: MarkerProps) => {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoOpen, setInfoOpen] = useState(false);

    const position = {
        lat: coordinate.latitude,
        lng: coordinate.longitude,
    };

    const hasInfo = Boolean(title || description);

    return (
        <>
            <AdvancedMarker
                ref={markerRef}
                position={position}
                title={title}
                onClick={hasInfo ? () => setInfoOpen(true) : undefined}
            >
                {image ? (
                    <Image source={image} style={{ width: 32, height: 32 }} />
                ) : pinColor ? (
                    <Pin background={pinColor} />
                ) : null}
            </AdvancedMarker>

            {infoOpen && hasInfo && (
                <InfoWindow anchor={marker} onClose={() => setInfoOpen(false)}>
                    <div
                        onClick={onCalloutPress}
                        style={{
                            cursor: onCalloutPress ? "pointer" : "default",
                            padding: 4,
                        }}
                    >
                        {title && (
                            <strong style={{ display: "block" }}>
                                {title}
                            </strong>
                        )}
                        {description && <span>{description}</span>}
                    </div>
                </InfoWindow>
            )}
        </>
    );
};

interface MapViewProps {
    style?: any;
    children?: React.ReactNode;
    initialRegion?: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
    onLongPress?: (event: any) => void;
    showsUserLocation?: boolean;
    [key: string]: any;
}

const MapView = forwardRef<any, MapViewProps>(
    ({ style, children, initialRegion, onLongPress }, _ref) => {
        const defaultCenter = initialRegion
            ? { lat: initialRegion.latitude, lng: initialRegion.longitude }
            : { lat: 0, lng: 0 };

        const defaultZoom = initialRegion
            ? deltaToZoom(initialRegion.latitudeDelta + 1)
            : 10;

        const handleClick = onLongPress
            ? (e: any) => {
                  if (!e.detail?.latLng) return;
                  onLongPress({
                      nativeEvent: {
                          coordinate: {
                              latitude: e.detail.latLng.lat,
                              longitude: e.detail.latLng.lng,
                          },
                          action: "press",
                      },
                  });
              }
            : undefined;

        return (
            <View style={[{ flex: 1 }, style]}>
                <APIProvider apiKey={API_KEY}>
                    <Map
                        style={{ width: "100%", height: "100%" }}
                        mapId="8883d749fdf0e73d"
                        defaultCenter={defaultCenter}
                        defaultZoom={defaultZoom}
                        onClick={handleClick}
                        gestureHandling="greedy"
                    >
                        {children}
                    </Map>
                </APIProvider>
            </View>
        );
    },
);

MapView.displayName = "MapView";

export default MapView;
