import type { PrayerTimes } from '@/types';

export const ALADHAN_METHODS: { value: number; label: string }[] = [
  { value: 0, label: 'Shia Ithna-Ansari' },
  { value: 1, label: 'University of Islamic Sciences, Karachi' },
  { value: 2, label: 'Islamic Society of North America (ISNA)' },
  { value: 3, label: 'Muslim World League' },
  { value: 4, label: 'Umm Al-Qura University, Makkah' },
  { value: 5, label: 'Egyptian General Authority of Survey' },
  { value: 7, label: 'Institute of Geophysics, University of Tehran' },
  { value: 8, label: 'Gulf Region' },
  { value: 9, label: 'Kuwait' },
  { value: 10, label: 'Qatar' },
  { value: 11, label: 'Majlis Ugama Islam Singapura, Singapore' },
  { value: 12, label: 'Union Organization Islamic de France' },
  { value: 13, label: 'Diyanet İşleri Başkanlığı, Turkey' },
  { value: 14, label: 'Spiritual Administration of Muslims of Russia' },
  { value: 15, label: 'Moonsighting Committee Worldwide' },
  { value: 16, label: 'Dubai (informal)' },
  { value: 17, label: 'Jabatan Kemajuan Islam Malaysia (JAKIM)' },
  { value: 18, label: 'Tunisia' },
  { value: 19, label: 'Algeria' },
  { value: 20, label: 'KEMENAG - Kementerian Agama Republik Indonesia' },
  { value: 21, label: 'Morocco' },
  { value: 22, label: 'Comunidade Islamica de Lisboa' },
  { value: 23, label: 'Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan' },
];

export const ALADHAN_SCHOOLS: { value: number; label: string }[] = [
  { value: 0, label: 'Shafi (Standard)' },
  { value: 1, label: 'Hanafi' },
];

export interface AladhanSettings {
  enabled: boolean;
  method: number;
  school: number;
}

export const DEFAULT_ALADHAN_SETTINGS: AladhanSettings = {
  enabled: false,
  method: 3,
  school: 0,
};

interface AladhanTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Jumuah?: string;
}

interface AladhanResponse {
  code: number;
  status: string;
  data: {
    timings: AladhanTimings;
  };
}

function to12Hour(time24: string): string {
  const [h, m] = time24.replace(/\s*\(.*\)/, '').trim().split(':');
  const hour = parseInt(h, 10);
  const minute = m;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${ampm}`;
}

export async function fetchAladhanPrayerTimes(
  latitude: number,
  longitude: number,
  method: number,
  school: number
): Promise<PrayerTimes | null> {
  try {
    const today = new Date();
    const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json: AladhanResponse = await res.json();
    if (json.code !== 200) return null;

    const t = json.data.timings;
    return {
      fajr: to12Hour(t.Fajr),
      dhuhr: to12Hour(t.Dhuhr),
      asr: to12Hour(t.Asr),
      maghrib: to12Hour(t.Maghrib),
      isha: to12Hour(t.Isha),
      jummah: to12Hour(t.Dhuhr),
      lastUpdated: null,
    };
  } catch {
    return null;
  }
}
