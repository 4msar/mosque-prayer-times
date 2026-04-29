import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Bookmark, HelpCircle, MapPin, Navigation, Search, Settings2 } from 'lucide-react';

const steps = [
  {
    icon: <Navigation className="h-5 w-5 text-green-600" />,
    title: 'Allow Location Access',
    description:
      'Grant location permission when prompted so the app can find mosques near you. You can also pin a custom location from the Settings.',
  },
  {
    icon: <Search className="h-5 w-5 text-blue-600" />,
    title: 'Browse Nearby Mosques',
    description:
      'The map and list show mosques within your selected search radius. Tap any mosque to see its details and prayer times.',
  },
  {
    icon: <MapPin className="h-5 w-5 text-red-500" />,
    title: 'View Prayer Times',
    description:
      "Open a mosque card to see today's Fajr, Dhuhr, Asr, Maghrib, and Isha times. Times are calculated using your chosen method in Settings.",
  },
  {
    icon: <Bookmark className="h-5 w-5 text-yellow-500" />,
    title: 'Bookmark Mosques',
    description:
      'Tap the bookmark icon on any mosque to save it. Access your saved mosques at any time from the Bookmarks tab in Settings.',
  },
  {
    icon: <Settings2 className="h-5 w-5 text-gray-500" />,
    title: 'Customise Settings',
    description:
      'Open Settings (⚙) to change the search radius, prayer calculation method, Asr school, sort order, and dark mode.',
  },
];

export const HelpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="h-4 w-4" />
            How to use Mosque Prayer Times
          </DialogTitle>
        </DialogHeader>

        <ol className="mt-2 flex flex-col gap-5">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                {step.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-600">
          Prayer times are provided for informational purposes only.
        </p>
      </DialogContent>
    </Dialog>
  );
};