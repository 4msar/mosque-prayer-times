import { fetchAladhanPrayerTimes } from '@/services/aladhan';
import { useSettingsStore } from '@/store/settings-store';
import type { PrayerTimes } from '@/types';
import useSWR from 'swr';

type Coords = { latitude: number; longitude: number } | undefined;

const fetcher = async ([, lat, lng, method, school]: [string, number, number, number, number]): Promise<PrayerTimes | null> => {
  return fetchAladhanPrayerTimes(lat, lng, method, school);
};

export const useAladhanPrayerTimes = (coords: Coords) => {
  const { aladhan } = useSettingsStore();

  const shouldFetch = aladhan.enabled && coords !== undefined;

  const { data, isLoading } = useSWR(
    shouldFetch
      ? ['aladhan', coords!.latitude, coords!.longitude, aladhan.method, aladhan.school]
      : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60_000 * 5 }
  );

  return {
    data: data ?? null,
    isLoading,
  };
};
