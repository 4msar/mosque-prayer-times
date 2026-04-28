import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const getMosqueDetails = async (placeId: string) => {
    const docRef = doc(db, "mosques", placeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
};
