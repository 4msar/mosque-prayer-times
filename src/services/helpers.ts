import type { PrayerKey, PrayerTimes } from '@/types';
import dayjs from '@/lib/dayjs';

export const defaultPrayerTimes: PrayerTimes = {
  fajr: '5:00 AM',
  dhuhr: '01:30 PM',
  asr: '4:30 PM',
  maghrib: '6:00 PM',
  isha: '8:00 PM',
  jummah: '1:30 PM',
  lastUpdated: null,
};

export const PRAYER_LABELS: { key: PrayerKey; label: string; arabicName: string; emoji: string }[] =
  [
    { key: 'fajr', label: 'Fajr', arabicName: 'الفجر', emoji: '🌅' },
    { key: 'dhuhr', label: 'Dhuhr', arabicName: 'الظهر', emoji: '☀️' },
    { key: 'asr', label: 'Asr', arabicName: 'العصر', emoji: '🌤️' },
    { key: 'maghrib', label: 'Maghrib', arabicName: 'المغرب', emoji: '🌇' },
    { key: 'isha', label: 'Isha', arabicName: 'العشاء', emoji: '🌙' },
    { key: 'jummah', label: "Jumu'ah", arabicName: 'الجمعة', emoji: '🕌' },
  ];

// "02:00 AM" or "12:00 PM"
export const timeRegex = /^([0-9]|0[0-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$/;

export function getNextPrayer(times: PrayerTimes): PrayerKey | null {
  const now = dayjs();

  for (const { key } of PRAYER_LABELS) {
    const t = dayjs(times[key], ['hh:mm A', 'HH:mm A', 'h:mm A', 'H:mm A'], true);

    // check if today is friday and the prayer is jummah
    if (now.day() === 5 && key === 'jummah') {
      if (t.isValid() && t.isAfter(now, 'minute')) return key;
    }

    if (t.isValid() && t.isAfter(now, 'minute')) return key;
  }

  return null;
}
