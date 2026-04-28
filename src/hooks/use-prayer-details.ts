import { db } from "@/services/firebaseConfig";
import { type PrayerDetails } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export const usePrayerDetails = (placeId: string) => {
    const [data, setData] = useState<PrayerDetails | null>(null);

    useEffect(() => {
        if (!placeId) return;

        let cancelled = false;

        const load = async () => {
            try {
                const docSnap = await getDoc(doc(db, "mosques", placeId));

                if (!cancelled && docSnap.exists()) {
                    setData(docSnap.data() as PrayerDetails);
                }
            } catch (err) {
                console.error("Error loading mosque:", err);
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [placeId]);

    return data;
}