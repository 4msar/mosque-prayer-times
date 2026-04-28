import { db } from "@/services/firebaseConfig";
import { PrayerDetails } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

export const usePrayerDetails = (placeId: string) => {
    const [data, setData] = useState<PrayerDetails|null>(null);

    const loadPrayerDetails = useCallback(async () => {
        try {
            const docSnap = await getDoc(doc(db, "mosques", placeId));
    
            if (docSnap.exists()) {
                const data = docSnap.data();
                setData(data as PrayerDetails);
            }
        } catch (err) {
            console.error("Error loading mosque:", err);
        }
    }, [placeId]);

    useEffect(() => {
        loadPrayerDetails();
    }, [loadPrayerDetails]);

    return data;
}