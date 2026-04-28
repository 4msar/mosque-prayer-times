import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";

export const useMosqueDetails = (placeId: string | null) => {
    const placesLib = useMapsLibrary("places");
    useMapsLibrary("maps");
    const map = useMap();

    const [result, setResult] = useState<google.maps.places.PlaceResult | null>(null);

    const fetchDetails = useCallback(() => {
        if (!map || !placesLib || !placeId) return;

        const service = new placesLib.PlacesService(map);
        service.getDetails({ placeId }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                setResult(place);
            } else {
                console.error("Error fetching place details:", status);
            }
        });
    }, [map, placesLib, placeId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    return result;
};
