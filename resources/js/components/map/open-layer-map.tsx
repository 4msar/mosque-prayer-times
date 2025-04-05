import { useMapStore } from '@/store';
import { Mosque } from '@/types';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import { OSM } from 'ol/source';
import View from 'ol/View';
import { useEffect, useMemo, useRef } from 'react';
import { addFeatures } from './utils';

export const OpenLayerMap = ({ currentLocation, items }: { currentLocation: GeolocationPosition | null; items: Mosque[] }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const map = useMapStore((state) => state.map);
    const setMap = useMapStore((state) => state.setMap);

    const center = useMemo(() => {
        return [currentLocation?.coords.longitude || 0, currentLocation?.coords.latitude || 0];
    }, [currentLocation]);

    useEffect(() => {
        if (!mapRef.current) return;

        setMap(
            new Map({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
            }),
        );

        return () => {
            if (map) {
                map.setTarget(undefined);
                map.dispose();

                setMap(null);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!map) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.addEventListener('click', (evt: any) => {
            const coordinate = map.getEventCoordinate(evt.originalEvent);
            const lonLat = map.getCoordinateFromPixel(coordinate);
            console.log('lonLat', lonLat);
        });

        map.setView(
            new View({
                center,
                zoom: 18,
                projection: 'EPSG:4326',
            }),
        );
    }, [map, center]);

    useEffect(() => {
        if (!map) return;

        addFeatures(items, map);
    }, [map, items]);

    return <div ref={mapRef} className="h-full w-full" />;
};
