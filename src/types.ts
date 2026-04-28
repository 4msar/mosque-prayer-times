import { Timestamp } from "firebase/firestore";

export type RootStackParamList = {
    Home: undefined;
    MosqueDetails: {
        placeId: string;
        name?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
    };
};

export interface MosqueDetailsContentProps {
    placeId: string;
    initialName?: string;
    initialAddress?: string;
    initialLatitude?: number;
    initialLongitude?: number;
}

export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha" | "jummah";

export interface PrayerTimes {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    jummah: string;
    lastUpdated: string | null;
}

export interface PrayerDetails {
    prayerTimes: PrayerTimes;
    lastUpdated: Timestamp | null;
}