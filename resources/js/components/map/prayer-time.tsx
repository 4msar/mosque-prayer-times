import { Moon, Sun, SunDim, SunMedium, Sunrise, Sunset } from 'lucide-react';

type Background = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'jummah';

export const PrayerTime = ({ name, time, bg }: { bg: Background; name: string; time: string }) => {
    return (
        <div
            className={`relative flex min-h-20 w-auto min-w-24 flex-col items-center justify-between gap-4 rounded-lg border border-gray-500 p-4 shadow-md transition-all duration-200 hover:scale-105`}
        >
            <div className="text-lg font-semibold text-slate-600">{name}</div>
            <div className="text-xl font-bold">{time}</div>

            <div className="absolute -right-8 bottom-0 h-2/3 w-2/3 opacity-30">
                {bg === 'morning' && <Sunrise className="h-full w-full object-cover text-yellow-400" />}
                {bg === 'noon' && <Sun className="h-full w-full object-cover text-orange-500" />}
                {bg === 'afternoon' && <SunDim className="h-full w-full object-cover text-sky-500" />}
                {bg === 'evening' && <Sunset className="h-full w-full object-cover text-orange-700" />}
                {bg === 'night' && <Moon className="h-full w-full object-cover text-blue-500" />}
                {bg === 'jummah' && <SunMedium className="h-full w-full object-cover text-red-500" />}
            </div>
        </div>
    );
};
