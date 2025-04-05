import { create } from 'zustand';

interface MosqueStore {
    placeId: string | null;
    setPlaceId: (placeId: string | null) => void;
    mosque: google.maps.places.Place | null;
    setMosque: (mosque: google.maps.places.Place | null) => void;
}

export const useMosqueStore = create<MosqueStore>()((set) => ({
    placeId: null,
    mosque: null,
    setMosque: (mosque) => set({ mosque }),
    setPlaceId: (placeId) => set({ placeId }),
}));
