import type Map from 'ol/Map';
import { create } from 'zustand';

interface MapStore {
    map: Map | null;
    setMap: (map: Map | null) => void;
}

export const useMapStore = create<MapStore>()((set) => ({
    map: null,
    setMap: (map) => set({ map }),
}));
