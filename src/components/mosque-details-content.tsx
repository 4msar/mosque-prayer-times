import { Button } from "@/components/ui/button";
import { useMosqueDetails } from "@/hooks/use-mosque-details";
import { usePrayerDetails } from "@/hooks/use-prayer-details";
import { defaultPrayerTimes } from "@/services/helpers";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
    Clock,
    Loader2,
    Pencil
} from "lucide-react";
import { useState } from "react";
import { MosqueHeaderBanner } from "./mosque-header-banner";
import { PrayerTimesDisplay } from "./prayer-times-display";
import { PrayerTimesForm } from "./prayer-times-form";
import { MosqueDetailsContentProps } from "@/types";

dayjs.extend(customParseFormat);


export function MosqueDetailsContent({
    placeId,
    ...initialDetails
}: MosqueDetailsContentProps) {
    const mosqueDetails = useMosqueDetails(placeId);
    const prayerDetails = usePrayerDetails(placeId);
    const prayerTimes = prayerDetails?.prayerTimes ?? defaultPrayerTimes;


    const [isEditing, setIsEditing] = useState(false);

    if (!mosqueDetails) {
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
            <MosqueHeaderBanner mosqueDetails={mosqueDetails} initialDetails={initialDetails} />

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
                    {prayerTimes && !isEditing && (
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

                {prayerTimes.lastUpdated && !isEditing ? (
                    <PrayerTimesDisplay prayerTimes={prayerTimes} />
                ) : (
                    <PrayerTimesForm mosqueDetails={mosqueDetails} placeId={placeId} prayerTimes={prayerTimes} />
                )}
            </div>
        </div>
    );
}
