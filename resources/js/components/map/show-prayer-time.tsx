import { Payload } from '@/hooks';
import { PrayerTime } from './prayer-time';

export const ShowPrayerTime = ({ isLoading, item, details }: { item: google.maps.places.Place | null; details: Payload; isLoading: boolean }) => {
    if (!item || !details) {
        return null;
    }

    const convert24HourFormat = (time: string) => {
        const [hour, minute] = time.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const adjustedHour = hour % 12 || 12; // Convert to 12-hour format
        return `${adjustedHour}:${minute.toString().padStart(2, '0')} ${period}`;
    };

    return (
        <div className="relative">
            <h2 className="px-4 pt-2 text-2xl font-bold">Prayer Times</h2>
            {isLoading ? (
                <div className="flex items-center justify-center p-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 p-4 pt-1 md:grid-cols-2">
                    <PrayerTime bg="morning" name="Fajr" time={convert24HourFormat(details.fajr)} />
                    <PrayerTime bg="noon" name="Dhuhr" time={convert24HourFormat(details.dhuhr)} />
                    <PrayerTime bg="afternoon" name="Asr" time={convert24HourFormat(details.asr)} />
                    <PrayerTime bg="evening" name="Maghrib" time={convert24HourFormat(details.maghrib)} />
                    <PrayerTime bg="night" name="Isha" time={convert24HourFormat(details.isha)} />
                    <PrayerTime bg="jummah" name="Jummah" time={convert24HourFormat(details.jummah)} />
                </div>
            )}
        </div>
    );
};
