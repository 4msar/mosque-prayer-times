import { Button } from '@/components/ui/button';
import { useAladhanPrayerTimes } from '@/hooks/use-aladhan-prayer-times';
import { useMosqueDetails } from '@/hooks/use-mosque-details';
import { usePrayerDetails } from '@/hooks/use-prayer-details';
import { defaultPrayerTimes } from '@/services/helpers';
import { useSettingsStore } from '@/store/settings-store';
import type { MosqueDetailsContentProps } from '@/types';
import dayjs from '@/lib/dayjs';
import { Timestamp } from 'firebase/firestore';
import { Clock, Pencil } from 'lucide-react';
import { useState } from 'react';
import { MosqueHeaderBanner } from './mosque-header-banner';
import { PrayerTimesDisplay } from './prayer-times-display';
import { PrayerTimesForm } from './prayer-times-form';
import { Skeleton } from './ui/skeleton';

export function MosqueDetailsContent({ placeId, ...initialDetails }: MosqueDetailsContentProps) {
  const { data: mosqueDetails, loading: mosqueDetailsLoading } = useMosqueDetails(placeId);
  const { data: prayerDetails, isLoading: prayerDetailsLoading, mutate } = usePrayerDetails(placeId);
  const { aladhan } = useSettingsStore();
  const [isEditing, setIsEditing] = useState(false);

  const mosqueCoords =
    mosqueDetails
      ? { latitude: mosqueDetails.location?.lat() ?? 0, longitude: mosqueDetails.location?.lng() ?? 0 }
      : undefined;

  const { data: aladhanTimes, isLoading: aladhanLoading } = useAladhanPrayerTimes(
    !prayerDetails && aladhan.enabled ? mosqueCoords : undefined
  );

  const prayerTimes = prayerDetails?.prayerTimes ?? defaultPrayerTimes;

  const handleSaved = ({ prayerTimes: updatedTimes, lastUpdated }: { prayerTimes: typeof prayerTimes; lastUpdated: Date }) => {
    mutate(
      (current) => ({
        ...(current ?? {
          name: mosqueDetails?.displayName ?? '',
          address: mosqueDetails?.formattedAddress ?? '',
          latitude: mosqueDetails?.location?.lat() ?? 0,
          longitude: mosqueDetails?.location?.lng() ?? 0,
        }),
        prayerTimes: updatedTimes,
        lastUpdated: Timestamp.fromDate(lastUpdated),
      }),
      { revalidate: false }
    );
    setIsEditing(false);
  };

  const getDate = (date: Timestamp | null) => {
    if (date) {
      return dayjs(date.seconds * 1000);
    }
    return dayjs(prayerTimes.lastUpdated);
  };

  const isLoading = mosqueDetailsLoading || prayerDetailsLoading || (aladhan.enabled && !prayerDetails && aladhanLoading);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 min-h-[260px] items-center justify-center">
        <Skeleton className="h-42 w-full rounded-md mb-4" />
        <Skeleton className="h-full flex-1 min-h-64 w-full rounded-md" />
      </div>
    );
  }

  const showAladhan = !prayerDetails && !isEditing && aladhan.enabled && aladhanTimes;

  return (
    <div className="flex flex-col">
      {mosqueDetails && (
        <MosqueHeaderBanner mosqueDetails={mosqueDetails} initialDetails={initialDetails} />
      )}

      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <Clock className="h-4 w-4 text-green-600" />
              Prayer Times
            </h3>
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs text-green-700 hover:text-green-800"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3 w-3" />
              {prayerDetails ? 'Edit' : 'Add'}
            </Button>
          )}
        </div>

        {/* Has prayer times from Firebase and not editing */}
        {prayerDetails && !isEditing && <PrayerTimesDisplay prayerTimes={prayerTimes} />}

        {/* AlAdhan fallback when no Firebase prayer times */}
        {showAladhan && (
          <>
            <PrayerTimesDisplay prayerTimes={aladhanTimes} />
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <a
                href="https://aladhan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/60"
              >
                <span>🕌</span>
                Prayer times provided by AlAdhan.com
              </a>
            </div>
          </>
        )}

        {/* No Firebase prayer times and AlAdhan disabled — show form */}
        {mosqueDetails && !prayerDetails && !isEditing && !aladhan.enabled && (
          <>
            <p className="text-sm text-center mb-4 border p-4 rounded-lg text-yellow-700 bg-yellow-50">
              No prayer times available. Please add prayer times below.
            </p>
            <PrayerTimesForm
              mosqueDetails={mosqueDetails}
              placeId={placeId}
              prayerTimes={prayerTimes}
              existsPrayerTimes={false}
              onCancel={() => setIsEditing(false)}
              onSaved={handleSaved}
            />
          </>
        )}

        {/* AlAdhan enabled but couldn't fetch */}
        {mosqueDetails && !prayerDetails && !isEditing && aladhan.enabled && !aladhanTimes && (
          <>
            <p className="text-sm text-center mb-4 border p-4 rounded-lg text-yellow-700 bg-yellow-50">
              Could not load prayer times from AlAdhan. Please add times manually.
            </p>
            <PrayerTimesForm
              mosqueDetails={mosqueDetails}
              placeId={placeId}
              prayerTimes={prayerTimes}
              existsPrayerTimes={false}
              onCancel={() => setIsEditing(false)}
              onSaved={handleSaved}
            />
          </>
        )}

        {/* Editing existing prayer times */}
        {mosqueDetails && isEditing && (
          <PrayerTimesForm
            mosqueDetails={mosqueDetails}
            existsPrayerTimes={true}
            placeId={placeId}
            prayerTimes={prayerTimes}
            onCancel={() => setIsEditing(false)}
            onSaved={handleSaved}
          />
        )}

        {/* No mosque details at all */}
        {!mosqueDetails && !prayerDetails && (
          <div className="flex min-h-[260px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No prayer times available</p>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-4">
          {prayerDetails?.lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Last Updated: {getDate(prayerDetails.lastUpdated).format('D MMM YYYY, hh:mm A')}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
