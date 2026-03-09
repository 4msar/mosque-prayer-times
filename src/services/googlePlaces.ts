// src/services/googlePlaces.js

export const fetchNearbyMosques = async (latitude, longitude, radius = 1000) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "dummy-api-key";
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=mosque&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return data.results || [];
    } catch (error) {
        console.error("Error fetching nearby mosques", error);
        return [];
    }
};

export const fetchPlaceDetails = async (placeId) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "dummy-api-key";
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.result || null;
    } catch (error) {
        console.error("Error fetching place details", error);
        return null;
    }
};
