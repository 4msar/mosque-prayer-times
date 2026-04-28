import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { type Location } from "./use-location";

export const useGetNearByPlaces = (location: Location | null, radius = 500) => {
    const placesLib = useMapsLibrary("places");
    useMapsLibrary("maps");
    const map = useMap();

    const [results, setResults] = useState<google.maps.places.Place[]>([]);

    const findMosques = useCallback(() => {
        if (!map || !placesLib || !location) return;

        const request = {
            // required parameters
            fields: [
                "displayName",
                "formattedAddress",
                "googleMapsURI",
                "location",
                "businessStatus",
                "nationalPhoneNumber",
                "photos",
                "plusCode",
                "primaryType",
                "rating",
                "types",
            ],
            locationRestriction: {
                center: new google.maps.LatLng(
                    location.latitude,
                    location.longitude,
                ),
                radius,
            },
            // optional parameters
            includedPrimaryTypes: ["mosque"],
            maxResultCount: 20,
            rankPreference: placesLib.SearchNearbyRankPreference.DISTANCE,
            language: "en-US",
        };

        placesLib.Place.searchNearby(request).then((response: { places: google.maps.places.Place[] }) => {
            if (!response.places) return;

            setResults(
                response.places.filter(
                    (place: google.maps.places.Place) => place.businessStatus === "OPERATIONAL",
                ),
            );
        });
    }, [map, placesLib, location, radius]);

    useEffect(() => {
        findMosques();
    }, [location, radius, findMosques]);

    return results;
};
