import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export const useMosqueDetails = (placeId: string | null) => {
    const placesLib = useMapsLibrary("places");
    useMapsLibrary("maps");
    const map = useMap();

    const [result, setResult] = useState<google.maps.places.Place | null>(null);

    useEffect(() => {
        if (!map || !placesLib || !placeId) return;

        let cancelled = false;

        const load = async () => {
            const service = new placesLib.Place({ id: placeId });
            const place = await service.fetchFields({
                fields: [
                    "displayName", "formattedAddress", "googleMapsURI", "location",
                    "businessStatus", "nationalPhoneNumber", "photos", "plusCode",
                    "primaryType", "rating", "types", "currentOpeningHours", "userRatingCount",
                ],
            });
            if (!cancelled) setResult(place.place);
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [map, placesLib, placeId]);

    return result;
};
