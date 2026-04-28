import { SettingsDialog } from '@/components/settings-dialog';

export const Header = () => {
  return (
    <header className="flex sticky top-0 z-10 items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
        <img src="/icons/icon-512x512.png" alt="logo" className="h-8 w-8" />
      </div>
      <div className="h-8 flex flex-col items-start justify-center gap-0.5">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-4 mt-2">
          <span className="hidden md:block">Mosque Prayer Times</span>
          <span className="block md:hidden">MPT</span>
        </h1>
        <p className="hidden text-sm text-gray-500 dark:text-gray-400 md:block">
          Find nearby mosques and their prayer times
        </p>
        <p className="block text-sm text-gray-500 dark:text-gray-400 md:hidden">
          Mosque prayer times
        </p>
      </div>

      <div className="ml-auto">
        <SettingsDialog />
      </div>
    </header>
  );
};
