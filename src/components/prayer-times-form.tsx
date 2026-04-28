import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { db } from '@/services/firebaseConfig';
import { PRAYER_LABELS, timeRegex } from '@/services/helpers';
import type { PrayerKey, PrayerTimes } from '@/types';
import dayjs from '@/lib/dayjs';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const PrayerTimesForm = ({
  mosqueDetails,
  placeId,
  prayerTimes,
  existsPrayerTimes,
  onCancel,
  onSaved,
}: {
  mosqueDetails: google.maps.places.Place;
  placeId: string;
  prayerTimes: PrayerTimes;
  existsPrayerTimes: boolean;
  onCancel: () => void;
  onSaved?: (updated: { prayerTimes: PrayerTimes; lastUpdated: Date }) => void;
}) => {
  const [formData, setFormData] = useState<PrayerTimes>(prayerTimes);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (field: PrayerKey, value: string) => {
    const finalValue = dayjs(value, 'HH:mm').format('hh:mm A');
    setFormData((prev) => ({ ...prev, [field]: finalValue }));
    setValidationError(
      timeRegex.test(finalValue) ? null : 'Invalid time format. Use H:MM AM/PM (e.g. 5:00 AM)'
    );
  };

  const handleSave = async () => {
    if (validationError) {
      toast.error(validationError);
      return;
    }
    try {
      setSaving(true);
      const lastUpdated = new Date();
      const docRef = doc(db, 'mosques', placeId);
      await setDoc(docRef, {
        name: mosqueDetails.displayName,
        address: mosqueDetails.formattedAddress,
        latitude: mosqueDetails.location?.lat() ?? 0,
        longitude: mosqueDetails.location?.lng() ?? 0,
        prayerTimes: formData,
        lastUpdated,
      });
      toast.success('Prayer times saved successfully.');
      setValidationError(null);
      onSaved?.({ prayerTimes: formData, lastUpdated });
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Failed to save prayer times.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(prayerTimes);
    setValidationError(null);
    onCancel();
  };

  return (
    <div className="rounded-xl border border-dashed border-green-200 bg-green-50/40 p-4 dark:border-green-800 dark:bg-green-950/20">
      <p className="mb-3 text-xs font-medium text-gray-600 dark:text-gray-400">
        {existsPrayerTimes
          ? 'Update prayer times'
          : 'No prayer times yet — add them for this mosque'}
      </p>
      <div className="space-y-2.5">
        {PRAYER_LABELS.map(({ key, label, emoji }) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <Label
              htmlFor={`panel-${key}`}
              className="w-28 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {emoji} {label}
            </Label>
            <Input
              id={`panel-${key}`}
              value={dayjs(formData[key], 'hh:mm A').format('HH:mm')}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              placeholder="05:00 AM"
              type="time"
              step="1800"
              min="00:00"
              max="23:59"
              className={cn(
                'h-8 text-sm w-1/2',
                validationError && !timeRegex.test(prayerTimes[key])
                  ? 'border-red-400 focus-visible:ring-red-400'
                  : ''
              )}
            />
          </div>
        ))}
      </div>

      {validationError && <p className="mt-2 text-xs text-red-500">{validationError}</p>}

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
        {existsPrayerTimes && (
          <Button variant="outline" size="sm" onClick={handleCancel} className="gap-2">
            <X className="h-3.5 w-3.5" />
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
