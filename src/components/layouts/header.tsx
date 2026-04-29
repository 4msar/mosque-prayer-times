import { SettingsDialog } from '@/components/settings-dialog';
import { Link, useLocation } from 'react-router-dom';
import { HelpDialog } from '../help-dialog';
import { useSettingsStore } from '@/store/settings-store';
import { Bookmark } from 'lucide-react';

export const Header = () => {
  const { bookmarks } = useSettingsStore();
  const location = useLocation();
  const isBookmarksPage = location.pathname === '/bookmarks';

  return (
    <header className="flex sticky top-0 z-10 items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
        <Link to="/">
          <img src="/icons/icon-512x512.png" alt="logo" className="h-8 w-8" />
        </Link>
      </div>
      <div className="h-8 flex flex-col items-start justify-center gap-0.5">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-4 mt-2">
          <span className="hidden md:block">Mosque Prayer Times</span>
          <span className="block md:hidden">MPT.life</span>
        </h1>
        <p className="hidden text-sm text-gray-500 dark:text-gray-400 md:block">
          Find nearby mosques and their prayer times
        </p>
        <p className="block text-sm text-gray-500 dark:text-gray-400 md:hidden">
          Mosque prayer times
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Link
          to="/bookmarks"
          aria-label="Bookmarks"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          <Bookmark
            className={isBookmarksPage ? 'h-5 w-5 fill-green-600 text-green-600' : 'h-5 w-5'}
          />
          {bookmarks.length > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[9px] font-bold text-white">
              {bookmarks.length > 9 ? '9+' : bookmarks.length}
            </span>
          )}
        </Link>
        <HelpDialog />
        <SettingsDialog />
      </div>
    </header>
  );
};
