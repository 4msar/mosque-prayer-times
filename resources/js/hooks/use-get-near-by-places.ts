import { Location } from '@/store';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useMemo, useState } from 'react';

export const useGetNearByPlaces = (location: Location | null) => {
    const placesLib = useMapsLibrary('places');
    const mapLib = useMapsLibrary('maps');
    const map = useMap();

    const [results, setResults] = useState<google.maps.places.Place[]>([]);

    const center = useMemo(() => {
        if (!location || !mapLib) return { lat: 0, lng: 0 };

        return new google.maps.LatLng(location.latitude, location.longitude);
    }, [location, mapLib]);

    useEffect(() => {
        if (!map || !placesLib) return;

        const request = {
            // required parameters
            fields: [
                'displayName',
                'formattedAddress',
                'googleMapsURI',
                'location',
                'businessStatus',
                'nationalPhoneNumber',
                'photos',
                'plusCode',
                'primaryType',
                'rating',
                'types',
            ],
            locationRestriction: {
                center,
                radius: 500,
            },
            // optional parameters
            includedPrimaryTypes: ['mosque'],
            maxResultCount: 20,
            rankPreference: placesLib.SearchNearbyRankPreference.POPULARITY,
            language: 'en-US',
        };

        placesLib.Place.searchNearby(request).then((response) => {
            setResults(response.places.filter((place) => place.businessStatus === 'OPERATIONAL'));
        });
    }, [location, map, placesLib, center]);

    return results;
};
