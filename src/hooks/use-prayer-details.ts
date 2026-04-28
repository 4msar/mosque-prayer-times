import { db } from '@/services/firebaseConfig';
import { type PrayerDetails } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import useSWR from 'swr';

const fetcher = async (placeId: string): Promise<PrayerDetails | null> => {
  const docSnap = await getDoc(doc(db, 'mosques', placeId));
  if (docSnap.exists()) {
    return docSnap.data() as PrayerDetails;
  }
  return null;
};

export const PRAYER_DETAILS_KEY = (placeId: string) => ['prayer-details', placeId] as const;

export const usePrayerDetails = (placeId: string) => {
  const { data, isLoading, mutate } = useSWR(
    placeId ? PRAYER_DETAILS_KEY(placeId) : null,
    ([, id]) => fetcher(id),
    { revalidateOnFocus: false }
  );

  return {
    data: data ?? null,
    isLoading,
    mutate,
  };
};
