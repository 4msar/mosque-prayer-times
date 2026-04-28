import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";

export const useMosqueDetails = (placeId: string | null) => {
    const placesLib = useMapsLibrary("places");
    useMapsLibrary("maps");
    const map = useMap();

    const [result, setResult] = useState<google.maps.places.Place | null>(null);

    const fetchDetails = useCallback(async () => {
        if (!map || !placesLib || !placeId) return;

        const service = new placesLib.Place({id:placeId});
        const place = await service.fetchFields({fields: ["displayName", "formattedAddress", "googleMapsURI", "location", "businessStatus", "nationalPhoneNumber", "photos", "plusCode", "primaryType", "rating", "types", "currentOpeningHours", "userRatingCount"]});
        setResult(place.place);
    }, [map, placesLib, placeId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    return result;
};
