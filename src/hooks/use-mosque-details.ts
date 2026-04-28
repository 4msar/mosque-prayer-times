import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

const getMosqueDetails = async (
  placesLib: google.maps.PlacesLibrary,
  placeId: string,
) => {
  const service = new placesLib.Place({ id: placeId });
  const place = await service.fetchFields({
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
      "currentOpeningHours",
      "userRatingCount",
    ],
  });

  return place.place;
};

export const useMosqueDetails = (placeId: string | null) => {
  const placesLib = useMapsLibrary("places");

  const [data, setData] = useState<google.maps.places.Place | null>(null);
  const [loading, setLoading] = useState(true);

  const prevPlaceId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!placesLib || !placeId) return;
    if (prevPlaceId.current === placeId) return;

    prevPlaceId.current = placeId;
    setLoading(true);

    getMosqueDetails(placesLib, placeId).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [placesLib, placeId]);

  return { data, loading };
};
