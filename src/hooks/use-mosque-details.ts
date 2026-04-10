import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { Location } from "./use-location";

export const useMosqueDetails = (placeId) => {
    const placesLib = useMapsLibrary("places");
    useMapsLibrary("maps");
    const map = useMap();

    const [result, setResult] = useState<google.maps.places.PlaceResult | null>(
        null,
    );

    const findMosques = useCallback(() => {
        if (!map || !placesLib || !location) return;

        const p = new placesLib.PlacesService(map);
        p.getDetails({ placeId }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log({ place });
                setResult(place);
            } else {
                console.error("Error fetching place details:", status);
            }
        });
    }, [map, placesLib, location]);

    useEffect(() => {
        findMosques();
    }, [location, findMosques]);

    return result;
};
