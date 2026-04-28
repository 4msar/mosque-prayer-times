const apiKey = () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "dummy-api-key";

export const fetchNearbyMosques = async (
    latitude: number,
    longitude: number,
    radius = 1000,
) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=mosque&key=${apiKey()}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return (data.results ?? []) as google.maps.places.PlaceResult[];
    } catch (error) {
        console.error("Error fetching nearby mosques", error);
        return [];
    }
};

export const fetchPlaceDetails = async (placeId: string) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey()}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return (data.result ?? null) as google.maps.places.PlaceResult | null;
    } catch (error) {
        console.error("Error fetching place details", error);
        return null;
    }
};
