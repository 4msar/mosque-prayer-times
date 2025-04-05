import useSWR from 'swr';

export const useGetPrayerTimes = (item: google.maps.places.Place | null) => {
    return useSWR(item?.id ? `/mosques/${item.id}` : null, () => {
        return fetch(`/mosques/${item?.id}`).then((res) => {
            if (!res.ok) {
                throw new Error('Failed to fetch prayer times');
            }
            return res.json();
        });
    });
};

export type PrayerPayload = {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    jummah: string;

    sunrise: string;
    sunset: string;
};

export type Payload = PrayerPayload & {
    id?: string;
    place_id?: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    map_url?: string;
};
