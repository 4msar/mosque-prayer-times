import { doc, setDoc, Timestamp, writeBatch } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { mosquesSeed, type MosqueSeed } from "../data/mosques-seed";
import type { PrayerDetails } from "../types";

function seedToPrayerDetails(mosque: MosqueSeed): PrayerDetails {
    const lastUpdated = Timestamp.fromDate(new Date(mosque.updatedAt));
    return {
        name: mosque.name,
        address: mosque.address,
        latitude: mosque.latitude,
        longitude: mosque.longitude,
        prayerTimes: {
            fajr: mosque.fajr,
            dhuhr: mosque.dhuhr,
            asr: mosque.asr,
            maghrib: mosque.maghrib,
            isha: mosque.isha,
            jummah: mosque.jummah,
            lastUpdated: mosque.updatedAt,
        },
        lastUpdated,
    };
}

/**
 * Import all mosques from the seed data into the Firestore `mosques` collection.
 * Uses batched writes (max 500 per batch) for efficiency.
 * Each document is keyed by `place_id`.
 *
 * @param onProgress  Optional callback invoked after each batch with (imported, total).
 */
export async function importMosquesToFirestore(
    onProgress?: (imported: number, total: number) => void,
): Promise<void> {
    const BATCH_SIZE = 500;
    const total = mosquesSeed.length;

    for (let i = 0; i < total; i += BATCH_SIZE) {
        const chunk = mosquesSeed.slice(i, i + BATCH_SIZE);
        const batch = writeBatch(db);

        for (const mosque of chunk) {
            const ref = doc(db, "mosques", mosque.placeId);
            batch.set(ref, seedToPrayerDetails(mosque));
        }

        await batch.commit();
        onProgress?.(Math.min(i + BATCH_SIZE, total), total);
    }
}

/**
 * Import a single mosque by its place ID. Useful for one-off updates.
 */
export async function importSingleMosque(placeId: string): Promise<boolean> {
    const mosque = mosquesSeed.find((m) => m.placeId === placeId);
    if (!mosque) return false;

    const ref = doc(db, "mosques", mosque.placeId);
    await setDoc(ref, seedToPrayerDetails(mosque));
    return true;
}


/**
 * Uses
 * ```ts
import { importMosquesToFirestore } from "@/services/import-mosques";

await importMosquesToFirestore((done, total) => {
    console.log(`${done}/${total} mosques imported`);
});
```
 */