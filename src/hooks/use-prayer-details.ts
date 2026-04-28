import { db } from '@/services/firebaseConfig';
import { type PrayerDetails } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const getPrayerDetails = async (placeId: string) => {
  const docSnap = await getDoc(doc(db, 'mosques', placeId));
  if (docSnap.exists()) {
    return docSnap.data() as PrayerDetails;
  }
  return null;
};

export const usePrayerDetails = (placeId: string): { data: PrayerDetails | null, loading: boolean } => {
  const [data, setData] = useState<PrayerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!placeId) return;

    getPrayerDetails(placeId).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [placeId]);

  return { data, loading };
};
