import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const getMosqueDetails = async (placeId) => {
    const docRef = doc(db, "mosques", placeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
};
