import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookmarkedMosque {
  placeId: string;
  name: string;
  address: string;
}

export type RankPreference = 'DISTANCE' | 'POPULARITY';

interface SettingsState {
  radius: number;
  rankPreference: RankPreference;
  darkMode: boolean;
  bookmarks: BookmarkedMosque[];
  chooseLocationFromMap: boolean;
  setRadius: (radius: number) => void;
  setRankPreference: (pref: RankPreference) => void;
  setDarkMode: (dark: boolean) => void;
  addBookmark: (mosque: BookmarkedMosque) => void;
  removeBookmark: (placeId: string) => void;
  isBookmarked: (placeId: string) => boolean;
  setLocationFromMap: (chooseLocationFromMap: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      radius: 500,
      rankPreference: 'DISTANCE' as RankPreference,
      darkMode: false,
      bookmarks: [],
      chooseLocationFromMap: false,

      setRadius: (radius) => set({ radius }),
      setRankPreference: (rankPreference) => set({ rankPreference }),
      setDarkMode: (darkMode) => {
        set({ darkMode });
        if (darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      addBookmark: (mosque) => {
        const { bookmarks } = get();
        if (bookmarks.some((b) => b.placeId === mosque.placeId)) return;
        set({ bookmarks: [...bookmarks, mosque] });
      },
      removeBookmark: (placeId) =>
        set({ bookmarks: get().bookmarks.filter((b) => b.placeId !== placeId) }),
      isBookmarked: (placeId) => get().bookmarks.some((b) => b.placeId === placeId),
      setLocationFromMap: (chooseLocationFromMap) => set({ chooseLocationFromMap }),
    }),
    {
      name: 'mpt-settings',
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
