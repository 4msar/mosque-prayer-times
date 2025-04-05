import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Location = {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: number;
};

export interface LocationStore {
    location: Location | null;
    setLocation: (location: Location | null) => void;
}

export const useLocationStore = create<LocationStore>()(
    persist(
        (set) => ({
            location: null,
            setLocation: (location) => set({ location }),
        }),
        {
            name: 'current-location',
        },
    ),
);
