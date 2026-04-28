import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { type RankPreference } from "@/store/settings-store";
import { type Location } from "./use-location";

export const useGetNearByPlaces = (
    location: Location | null,
    radius = 500,
    rankPreference: RankPreference = "DISTANCE",
) => {
    const placesLib = useMapsLibrary("places");
    useMapsLibrary("maps");
    const map = useMap();

    const [results, setResults] = useState<google.maps.places.Place[]>([]);

    const findMosques = useCallback(() => {
        if (!map || !placesLib || !location) return;

        const request = {
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
            includedPrimaryTypes: ["mosque"],
            maxResultCount: 20,
            rankPreference:
                rankPreference === "POPULARITY"
                    ? placesLib.SearchNearbyRankPreference.POPULARITY
                    : placesLib.SearchNearbyRankPreference.DISTANCE,
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
    }, [map, placesLib, location, radius, rankPreference]);

    useEffect(() => {
        findMosques();
    }, [location, radius, findMosques]);

    return results;
};
