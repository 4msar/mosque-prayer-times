import { useState, useEffect } from "react";
import { db } from "@/services/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { fetchPlaceDetails } from "@/services/googlePlaces";
import { toast } from "sonner";
import {
    Clock,
    ExternalLink,
    Loader2,
    MapPin,
    Pencil,
    Phone,
    Save,
    Star,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha" | "jummah";

interface PrayerTimes {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    jummah: string;
    lastUpdated: string | null;
}

const defaultPrayerTimes: PrayerTimes = {
    fajr: "5:00 AM",
    dhuhr: "01:30 PM",
    asr: "4:30 PM",
    maghrib: "6:00 PM",
    isha: "8:00 PM",
    jummah: "1:30 PM",
    lastUpdated: null,
};

const PRAYER_LABELS: { key: PrayerKey; label: string; arabicName: string; emoji: string }[] = [
    { key: "fajr", label: "Fajr", arabicName: "الفجر", emoji: "🌅" },
    { key: "dhuhr", label: "Dhuhr", arabicName: "الظهر", emoji: "☀️" },
    { key: "asr", label: "Asr", arabicName: "العصر", emoji: "🌤️" },
    { key: "maghrib", label: "Maghrib", arabicName: "المغرب", emoji: "🌇" },
    { key: "isha", label: "Isha", arabicName: "العشاء", emoji: "🌙" },
    { key: "jummah", label: "Jumu'ah", arabicName: "الجمعة", emoji: "🕌" },
];

const timeRegex = /^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$/;

function getNextPrayer(times: PrayerTimes): PrayerKey | null {
    const now = dayjs();
    for (const { key } of PRAYER_LABELS) {
        const t = dayjs(times[key], ["H:mm A", "h:mm A", "HH:mm A"], true);
        if (t.isValid() && t.isAfter(now)) return key;
    }
    return PRAYER_LABELS[0].key;
}

export interface MosqueDetailsContentProps {
    placeId: string;
    initialName?: string;
    initialAddress?: string;
    initialLatitude?: number;
    initialLongitude?: number;
}

export function MosqueDetailsContent({
    placeId,
    initialName,
    initialAddress,
}: MosqueDetailsContentProps) {
    const [mosquePlace, setMosquePlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [dataExists, setDataExists] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(defaultPrayerTimes);

    const mosqueName = mosquePlace?.name ?? initialName ?? "Mosque";
    const mosqueAddress = mosquePlace?.formatted_address ?? initialAddress;
    const mapsUrl = mosquePlace?.url;
    const phone = mosquePlace?.formatted_phone_number;
    const rating = mosquePlace?.rating;
    const totalRatings = mosquePlace?.user_ratings_total;
    const openNow = mosquePlace?.opening_hours?.isOpen?.();
    const nextPrayer = dataExists ? getNextPrayer(prayerTimes) : null;

    useEffect(() => {
        if (!placeId) return;
        setLoading(true);
        setMosquePlace(null);
        setPrayerTimes(defaultPrayerTimes);
        setDataExists(false);
        setIsEditing(false);

        const load = async () => {
            try {
                const [placeResult, docSnap] = await Promise.all([
                    fetchPlaceDetails(placeId),
                    getDoc(doc(db, "mosques", placeId)),
                ]);

                if (placeResult) setMosquePlace(placeResult);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPrayerTimes({
                        ...defaultPrayerTimes,
                        ...data.prayerTimes,
                        lastUpdated:
                            data.lastUpdated
                                ?.toDate()
                                ?.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                }) ?? null,
                    });
                    setDataExists(true);
                }
            } catch (err) {
                console.error("Error loading mosque:", err);
                toast.error("Failed to load mosque details.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [placeId]);

    const handleFieldChange = (field: PrayerKey, value: string) => {
        setPrayerTimes((prev) => ({ ...prev, [field]: value }));
        setValidationError(
            timeRegex.test(value) ? null : "Invalid time format. Use H:MM AM/PM (e.g. 5:00 AM)",
        );
    };

    const handleSave = async () => {
        if (validationError) {
            toast.error(validationError);
            return;
        }
        if (!placeId) return;

        setSaving(true);
        try {
            const docRef = doc(db, "mosques", placeId);
            await setDoc(docRef, {
                name: mosqueName,
                address: mosqueAddress,
                prayerTimes: {
                    fajr: prayerTimes.fajr,
                    dhuhr: prayerTimes.dhuhr,
                    asr: prayerTimes.asr,
                    maghrib: prayerTimes.maghrib,
                    isha: prayerTimes.isha,
                    jummah: prayerTimes.jummah,
                },
                lastUpdated: new Date(),
            });

            const updatedAt = new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            setPrayerTimes((prev) => ({ ...prev, lastUpdated: updatedAt }));
            setDataExists(true);
            setIsEditing(false);
            toast.success("Prayer times saved successfully.");
        } catch (err) {
            console.error("Error saving:", err);
            toast.error("Failed to save prayer times.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[260px] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    <p className="text-sm">Loading mosque details…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Mosque header banner */}
            <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-green-600 to-green-800 px-5 py-5 text-white">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 -left-4 h-20 w-20 rounded-full bg-white/5" />
                <div className="relative flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold leading-tight">{mosqueName}</h2>
                        {mosqueAddress && (
                            <p className="mt-1 flex items-start gap-1.5 text-xs text-green-100">
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span className="line-clamp-2">{mosqueAddress}</span>
                            </p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {openNow !== undefined && (
                                <span
                                    className={cn(
                                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                        openNow
                                            ? "bg-green-400/30 text-green-50"
                                            : "bg-red-400/30 text-red-100",
                                    )}
                                >
                                    {openNow ? "● Open now" : "● Closed"}
                                </span>
                            )}
                            {rating !== undefined && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                                    <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                                    {rating.toFixed(1)}
                                    {totalRatings && (
                                        <span className="text-white/70">({totalRatings.toLocaleString()})</span>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="shrink-0 text-3xl select-none">🕌</div>
                </div>

                {/* Action buttons */}
                <div className="relative mt-4 flex gap-2">
                    {mapsUrl && (
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                            <Button
                                size="sm"
                                variant="secondary"
                                className="gap-1.5 bg-white/20 text-white hover:bg-white/30 border-0"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Google Maps
                            </Button>
                        </a>
                    )}
                    {phone && (
                        <a href={`tel:${phone}`}>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="gap-1.5 bg-white/20 text-white hover:bg-white/30 border-0"
                            >
                                <Phone className="h-3.5 w-3.5" />
                                {phone}
                            </Button>
                        </a>
                    )}
                </div>
            </div>

            {/* Prayer times section */}
            <div className="mt-4">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <h3 className="text-sm font-semibold text-gray-800">Prayer Times</h3>
                        {prayerTimes.lastUpdated && (
                            <span className="text-[10px] text-muted-foreground">
                                · Updated {prayerTimes.lastUpdated}
                            </span>
                        )}
                    </div>
                    {dataExists && !isEditing && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 px-2 text-xs text-green-700 hover:text-green-800"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil className="h-3 w-3" />
                            Edit
                        </Button>
                    )}
                </div>

                {dataExists && !isEditing ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {PRAYER_LABELS.map(({ key, label, arabicName, emoji }) => {
                            const isNext = nextPrayer === key;
                            return (
                                <div
                                    key={key}
                                    className={cn(
                                        "relative flex flex-col items-center rounded-xl border px-3 py-3 text-center transition-shadow",
                                        isNext
                                            ? "border-green-300 bg-green-50 shadow-sm shadow-green-100 ring-1 ring-green-300"
                                            : "border-gray-100 bg-white",
                                    )}
                                >
                                    {isNext && (
                                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                                            Next
                                        </span>
                                    )}
                                    <span className="text-xl leading-none">{emoji}</span>
                                    <span className="mt-1.5 text-xs font-semibold text-gray-700">
                                        {label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">{arabicName}</span>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "mt-2 border px-2 py-0.5 text-xs font-medium",
                                            isNext
                                                ? "border-green-300 bg-green-600 text-white"
                                                : "border-green-100 bg-green-50 text-green-700",
                                        )}
                                    >
                                        {prayerTimes[key]}
                                    </Badge>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-green-200 bg-green-50/40 p-4">
                        <p className="mb-3 text-xs font-medium text-gray-600">
                            {prayerTimes.lastUpdated
                                ? "Update prayer times"
                                : "No prayer times yet — add them for this mosque"}
                        </p>
                        <div className="space-y-2.5">
                            {PRAYER_LABELS.map(({ key, label, emoji }) => (
                                <div key={key} className="flex items-center gap-3">
                                    <Label
                                        htmlFor={`panel-${key}`}
                                        className="w-28 shrink-0 text-sm font-medium text-gray-700"
                                    >
                                        {emoji} {label}
                                    </Label>
                                    <Input
                                        id={`panel-${key}`}
                                        value={prayerTimes[key]}
                                        onChange={(e) => handleFieldChange(key, e.target.value)}
                                        placeholder="5:00 AM"
                                        className={cn(
                                            "h-8 text-sm",
                                            validationError && !timeRegex.test(prayerTimes[key])
                                                ? "border-red-400 focus-visible:ring-red-400"
                                                : "",
                                        )}
                                    />
                                </div>
                            ))}
                        </div>

                        {validationError && (
                            <p className="mt-2 text-xs text-red-500">{validationError}</p>
                        )}

                        <div className="mt-4 flex gap-2">
                            <Button
                                onClick={handleSave}
                                disabled={saving || !!validationError}
                                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                                size="sm"
                            >
                                {saving ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Save className="h-3.5 w-3.5" />
                                )}
                                Save Times
                            </Button>
                            {isEditing && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(false)}
                                    className="gap-2"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
