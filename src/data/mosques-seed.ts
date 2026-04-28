export interface MosqueSeed {
    placeId: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    jummah: string;
    updatedAt: string;
}

/** Normalize "HH:MM:SS" or "HH:MM" → "hh:mm A" */
function t(time: string): string {
    const [hhStr, mm] = time.trim().substring(0, 5).split(":");
    const hh = parseInt(hhStr, 10);
    const period = hh >= 12 ? "PM" : "AM";
    const hour12 = hh % 12 || 12;
    return `${String(hour12).padStart(2, "0")}:${mm} ${period}`;
}

export const mosquesSeed: MosqueSeed[] = [
    {
        placeId: "ChIJr0dx5LjAVTcRGbnyl9hrJAM",
        name: "Baitus Salam Jame Masjid",
        address: "Q9M6+JWC, Dhaka, Bangladesh",
        latitude: 23.7840707,
        longitude: 90.3622786,
        fajr: t("05:15"),
        dhuhr: t("13:15:00"),
        asr: t("16:30:00"),
        maghrib: t("18:30:00"),
        isha: t("20:00:00"),
        jummah: t("13:30:00"),
        updatedAt: "2025-04-05 18:49:37",
    },
];
