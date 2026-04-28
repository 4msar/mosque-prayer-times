import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { db } from "@/services/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { fetchPlaceDetails } from "@/services/googlePlaces";
import { toast } from "sonner";
import { ArrowLeft, Clock, ExternalLink, Loader2, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const PRAYER_LABELS: { key: PrayerKey; label: string; emoji: string }[] = [
    { key: "fajr", label: "Fajr", emoji: "🌅" },
    { key: "dhuhr", label: "Dhuhr", emoji: "☀️" },
    { key: "asr", label: "Asr", emoji: "🌤️" },
    { key: "maghrib", label: "Maghrib", emoji: "🌇" },
    { key: "isha", label: "Isha", emoji: "🌙" },
    { key: "jummah", label: "Jumu'ah", emoji: "🕌" },
];

const timeRegex = /^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$/;

export default function MosqueDetailsPage() {
    const { placeId } = useParams<{ placeId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const routeState = location.state as {
        name?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
    } | null;

    const [mosquePlace, setMosquePlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [dataExists, setDataExists] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(defaultPrayerTimes);

    const mosqueName = mosquePlace?.name ?? routeState?.name ?? "Mosque";
    const mosqueAddress = mosquePlace?.formatted_address ?? routeState?.address;
    const mapsUrl = mosquePlace?.url;

    useEffect(() => {
        if (!placeId) return;

        const load = async () => {
            setLoading(true);
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
                        lastUpdated: data.lastUpdated
                            ?.toDate()
                            ?.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
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
        setValidationError(timeRegex.test(value) ? null : "Invalid time format. Use H:MM AM/PM (e.g. 5:00 AM)");
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
            const mosqueData = {
                name: mosqueName,
                address: mosqueAddress,
                latitude: mosquePlace?.geometry?.location?.lat() ?? routeState?.latitude,
                longitude: mosquePlace?.geometry?.location?.lng() ?? routeState?.longitude,
                prayerTimes: {
                    fajr: prayerTimes.fajr,
                    dhuhr: prayerTimes.dhuhr,
                    asr: prayerTimes.asr,
                    maghrib: prayerTimes.maghrib,
                    isha: prayerTimes.isha,
                    jummah: prayerTimes.jummah,
                },
                lastUpdated: new Date(),
            };

            await setDoc(docRef, mosqueData);

            const updatedAt = new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "long",
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
            <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    <p>Loading mosque details…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-slate-50">
            {/* Header */}
            <header className="flex items-center gap-3 border-b bg-white px-4 py-3 shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="shrink-0"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-base font-semibold text-gray-900">{mosqueName}</h1>
                    {mosqueAddress && (
                        <p className="truncate text-xs text-muted-foreground">{mosqueAddress}</p>
                    )}
                </div>
                {mapsUrl && (
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                    >
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Maps
                        </Button>
                    </a>
                )}
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Clock className="h-4 w-4 text-green-600" />
                                    Prayer Times
                                </CardTitle>
                                {prayerTimes.lastUpdated && (
                                    <CardDescription className="mt-1 text-xs">
                                        Updated: {prayerTimes.lastUpdated}
                                    </CardDescription>
                                )}
                            </div>
                            {dataExists && !isEditing && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-1">
                        {dataExists && !isEditing ? (
                            <>
                                {PRAYER_LABELS.map(({ key, label, emoji }) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between rounded-md px-3 py-2.5 odd:bg-slate-50"
                                    >
                                        <span className="text-sm font-medium text-gray-700">
                                            {emoji} {label}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="border-green-200 bg-green-50 text-green-700"
                                        >
                                            {prayerTimes[key]}
                                        </Badge>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-600">
                                    {prayerTimes.lastUpdated ? "Update prayer times" : "Add prayer times for this mosque"}
                                </p>
                                {PRAYER_LABELS.map(({ key, label, emoji }) => (
                                    <div key={key} className="grid grid-cols-2 items-center gap-3">
                                        <Label
                                            htmlFor={key}
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            {emoji} {label}
                                        </Label>
                                        <Input
                                            id={key}
                                            value={prayerTimes[key]}
                                            onChange={(e) => handleFieldChange(key, e.target.value)}
                                            placeholder="5:00 AM"
                                            className={cn(
                                                "text-sm",
                                                validationError && !timeRegex.test(prayerTimes[key])
                                                    ? "border-red-400 focus-visible:ring-red-400"
                                                    : "",
                                            )}
                                        />
                                    </div>
                                ))}

                                {validationError && (
                                    <p className="text-xs text-red-500">{validationError}</p>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving || !!validationError}
                                        className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                                    >
                                        {saving ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                        Save Times
                                    </Button>
                                    {isEditing && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="gap-2"
                                        >
                                            <X className="h-4 w-4" />
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
