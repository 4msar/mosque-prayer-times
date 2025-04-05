import { Location } from '@/store';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useState } from 'react';

export const useGetNearByPlaces = (location: Location | null) => {
    const placesLib = useMapsLibrary('places');
    useMapsLibrary('maps');
    const map = useMap();

    const [results, setResults] = useState<google.maps.places.Place[]>([]);

    const findMosques = useCallback(() => {
        if (!map || !placesLib || !location) return;

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
                center: new google.maps.LatLng(location.latitude, location.longitude),
                radius: 500,
            },
            // optional parameters
            includedPrimaryTypes: ['mosque'],
            maxResultCount: 20,
            rankPreference: placesLib.SearchNearbyRankPreference.POPULARITY,
            language: 'en-US',
        };

        placesLib.Place.searchNearby(request).then((response) => {
            console.log('response', response);
            if (!response.places) return;

            setResults(response.places.filter((place) => place.businessStatus === 'OPERATIONAL'));
        });
    }, [map, placesLib, location]);

    useEffect(() => {
        findMosques();
    }, [location, findMosques]);

    return results;
};
