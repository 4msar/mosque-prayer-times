import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { db } from "@/services/firebaseConfig";
import { PRAYER_LABELS, timeRegex } from "@/services/helpers";
import { PrayerKey, PrayerTimes } from "@/types";
import { doc, setDoc } from "firebase/firestore";
import {
    Loader2,
    Save,
    X
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export const PrayerTimesForm = ({ mosqueDetails, placeId, prayerTimes }: { mosqueDetails: google.maps.places.PlaceResult, placeId:string, prayerTimes: PrayerTimes }) => {
    const [formData, setFormData] = useState<PrayerTimes>(prayerTimes);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handleFieldChange = (field: PrayerKey, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setValidationError(
            timeRegex.test(value) ? null : "Invalid time format. Use H:MM AM/PM (e.g. 5:00 AM)",
        );
    };

    const handleSave = async () => {
        if (validationError) {
            toast.error(validationError);
            return;
        }
        try {
            setSaving(true);
            const docRef = doc(db, "mosques", placeId);
            await setDoc(docRef, {
                name: mosqueDetails.name,
                address: mosqueDetails.formatted_address,
                latitude: mosqueDetails.geometry?.location?.lat() ?? 0,
                longitude: mosqueDetails.geometry?.location?.lng() ?? 0,
                prayerTimes: formData,
                lastUpdated: new Date(),
            });
            toast.success("Prayer times saved successfully.");
            setFormData(prayerTimes);
            setValidationError(null);
        } catch (err) {
            console.error("Error saving:", err);
            toast.error("Failed to save prayer times.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(prayerTimes);
        setValidationError(null);
    };

    return ((
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="gap-2"
                    >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                    </Button>
            </div>
        </div>
    ))
}