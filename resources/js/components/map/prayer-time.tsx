export const PrayerTime = ({ name, time }: { name: string; time: string }) => {
    return (
        <div className="flex h-16 w-full min-w-24 flex-col items-center justify-between rounded-lg border border-gray-500 bg-gray-50 p-2 shadow-md md:h-20">
            <div className="text-sm font-semibold text-slate-900">{name}</div>
            <div className="text-sm font-semibold text-slate-900">{time}</div>
        </div>
    );
};
