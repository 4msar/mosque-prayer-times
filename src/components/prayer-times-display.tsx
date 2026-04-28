import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getNextPrayer, PRAYER_LABELS } from "@/services/helpers";
import type { PrayerKey, PrayerTimes } from "@/types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const PrayerTimesDisplay = ({
  prayerTimes,
}: {
  prayerTimes: PrayerTimes;
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {PRAYER_LABELS.map(({ key, label, arabicName, emoji }) => {
        const isNext = getNextPrayer(prayerTimes) === key;
        return (
          <div
            key={key}
            className={cn(
              "relative flex flex-col items-center rounded-xl border px-3 py-3 text-center transition-shadow",
              isNext
                ? "border-green-300 bg-green-50 shadow-sm shadow-green-100 ring-1 ring-green-300 dark:border-green-700 dark:bg-green-950/40 dark:shadow-green-900 dark:ring-green-700"
                : "border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800",
            )}
          >
            {isNext && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                Next
              </span>
            )}
            <span className="text-xl leading-none">{emoji}</span>
            <span className="mt-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
              {label}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {arabicName}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "mt-2 border px-2 py-0.5 text-xs font-medium",
                isNext
                  ? "border-green-300 bg-green-600 text-white dark:border-green-600"
                  : "border-green-100 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400",
              )}
            >
              {prayerTimes[key as PrayerKey]}
            </Badge>
          </div>
        );
      })}
    </div>
  );
};
