import { Button } from '@/components/ui/button';
import { useMosqueDetails } from '@/hooks/use-mosque-details';
import { usePrayerDetails } from '@/hooks/use-prayer-details';
import { defaultPrayerTimes } from '@/services/helpers';
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
  const { data: prayerDetails, loading: prayerDetailsLoading } = usePrayerDetails(placeId);
  const prayerTimes = prayerDetails?.prayerTimes ?? defaultPrayerTimes;
  const [isEditing, setIsEditing] = useState(false);

  const getDate = (date: Timestamp | null) => {
    if (date) {
      return dayjs(date.seconds * 1000);
    }
    return dayjs(prayerTimes.lastUpdated);
  };

  if (mosqueDetailsLoading || prayerDetailsLoading) {
    return (
      <div className="flex flex-col gap-4 min-h-[260px] items-center justify-center">
        {/* Skeleton */}
        <Skeleton className="h-42 w-full rounded-md mb-4" />
        <Skeleton className="h-full flex-1 min-h-64 w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Mosque header banner */}
      {mosqueDetails && (
        <MosqueHeaderBanner mosqueDetails={mosqueDetails} initialDetails={initialDetails} />
      )}

      {/* Prayer times section */}
      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <Clock className="h-4 w-4 text-green-600" />
              Prayer Times
            </h3>
          </div>
          {prayerDetails && !isEditing && (
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

        {/* Has prayer times and not editing — show display */}
        {prayerDetails && !isEditing && <PrayerTimesDisplay prayerTimes={prayerTimes} />}

        {/* Has mosque details but no prayer times — show message + form to add */}
        {mosqueDetails && !prayerDetails && !isEditing && (
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
