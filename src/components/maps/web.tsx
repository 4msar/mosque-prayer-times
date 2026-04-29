/* eslint-disable react-hooks/set-state-in-effect */
import {
  AdvancedMarker,
  Map,
  type MapMouseEvent,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetLocation, type Location } from '@/hooks/use-location';
import { useGetNearByPlaces } from '@/hooks/use-nearby-places';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { useSettingsStore } from '@/store/settings-store';
import { FloatingButton } from '@/components/floating-button';
import { MosqueDetailsOverlay } from '@/components/mosque-details-overlay';
import { WifiOff } from 'lucide-react';
import { useMosqueDetails } from '@/hooks/use-mosque-details';

const markerImage = '/marker.png';

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
  const mapLib = useMapsLibrary('maps');
  const map = useMap();
  const [selectedMosque, setSelectedMosque] = useState<SelectedMosque | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const { chooseLocationFromMap, setLocationFromMap } = useSettingsStore();
  const isOnline = useOnlineStatus();
  const [searchParams] = useSearchParams();
  const highlightedPlaceId = searchParams.get('placeId');

  const { location: geoLocation, getLocation } = useGetLocation();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(geoLocation ?? null);

  const { data: mosqueDetails } = useMosqueDetails(highlightedPlaceId);

  const { radius, rankPreference, darkMode } = useSettingsStore();

  const center = useMemo(() => {
    if (!currentLocation || !mapLib)
      return {
        lat: defaultLocation.latitude,
        lng: defaultLocation.longitude,
      };

    return new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
  }, [currentLocation, mapLib]);

  const mosques = useGetNearByPlaces(currentLocation ?? null, radius, rankPreference);

  const handleMapClick = (event: MapMouseEvent) => {
    if (!event.detail.latLng) return;
    // Close overlay when clicking map background
    if (!event.detail.placeId) {
      setOverlayOpen(false);

      if (chooseLocationFromMap) {
        setCurrentLocation({
          latitude: event.detail.latLng.lat,
          longitude: event.detail.latLng.lng,
        });

        setLocationFromMap(false);
      }

      return;
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

  const handleLocateMe = useCallback(() => {
    getLocation(true);
    if (!geoLocation) return;

    setCurrentLocation(geoLocation);

    setLocationFromMap(false);

    searchParams.delete('placeId');
    history.pushState(null, '', window.location.pathname);

    map?.setCenter({
      lat: geoLocation.latitude,
      lng: geoLocation.longitude,
    });
  }, [geoLocation, map, searchParams, setLocationFromMap, getLocation]);

  useEffect(() => {
    if (geoLocation) {
      setCurrentLocation(geoLocation);
    }
  }, [geoLocation]);

  useEffect(() => {
    if (currentLocation) {
      map?.setCenter({
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
      });
    }
  }, [currentLocation, geoLocation, map]);

  useEffect(() => {
    if (!highlightedPlaceId || !mosqueDetails?.location || !map) return;

    setCurrentLocation({
      latitude: mosqueDetails?.location?.lat(),
      longitude: mosqueDetails?.location?.lng(),
    });

    map.setCenter({ lat: mosqueDetails?.location?.lat(), lng: mosqueDetails?.location?.lng() });
    map.setZoom(18);
  }, [highlightedPlaceId, mosqueDetails?.location, map]);

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
        mapId={'8883d749fdf0e73d'}
        colorScheme={darkMode ? 'DARK' : 'LIGHT'}
        className="flex-1 h-full w-full"
      >
        {currentLocation && (
          <AdvancedMarker position={center}>
            <Pin background="#38bdf8" glyphColor="#082f49" borderColor="#0c4a6e">
              <span className="font-bold text-xs">You</span>
            </Pin>
          </AdvancedMarker>
        )}

        {mosques.map((item) => {
          const isHighlighted = item.id === highlightedPlaceId;
          return (
            <AdvancedMarker
              key={item.id}
              title={item.displayName ?? undefined}
              position={item.location}
              onClick={() => handleMosqueClick(item)}
            >
              <div className="relative flex items-center justify-center">
                {isHighlighted && (
                  <>
                    <span className="absolute inline-flex h-14 w-14 rounded-full bg-emerald-400 opacity-60 animate-ping" />
                    <span className="absolute inline-flex h-10 w-10 rounded-full bg-emerald-300 opacity-40 animate-ping [animation-delay:150ms]" />
                  </>
                )}
                <img
                  src={markerImage}
                  width={40}
                  height={40}
                  alt={item.displayName ?? 'mosque'}
                  className="relative z-10"
                />
              </div>
            </AdvancedMarker>
          );
        })}

        {chooseLocationFromMap && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm rounded-lg w-[60dvw] md:w-80 mx-auto text-center text-white">
            <span>Click on the map to choose a location</span>
          </div>
        )}
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
