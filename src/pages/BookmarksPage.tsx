import { Header } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/settings-store';
import { Bookmark, BookmarkX, MapPin, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useSettingsStore();

  return (
    <div className="flex h-dvh min-h-dvh flex-col">
      <Header />

      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="mb-5 flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Bookmarked Mosques
            </h2>
            {bookmarks.length > 0 && (
              <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400">
                {bookmarks.length}
              </span>
            )}
          </div>

          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <Bookmark className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="mb-1 text-base font-medium text-gray-700 dark:text-gray-300">
                No bookmarks yet
              </h3>
              <p className="mb-5 max-w-xs text-sm text-gray-500 dark:text-gray-400">
                Bookmark mosques from their detail page so you can find them quickly later.
              </p>
              <Button asChild size="sm" variant="default">
                <Link to="/">
                  Find nearby mosques
                  <MoveRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {bookmarks.map((mosque) => (
                <li
                  key={mosque.placeId}
                  className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-xl dark:bg-green-900/30">
                    🕌
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/mosque/${mosque.placeId}`}
                      className="block truncate text-sm font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100 dark:hover:text-green-400"
                    >
                      {mosque.name}
                    </Link>
                    {mosque.address && (
                      <p className="mt-0.5 flex items-start gap-1 truncate text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                        <span className="truncate">{mosque.address}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button asChild size="sm" variant="ghost" className="h-8 px-3 text-xs text-green-700 hover:bg-green-50 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-900/30">
                      <Link to={`/mosque/${mosque.placeId}`}>
                        View
                        <MoveRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <button
                      type="button"
                      onClick={() => removeBookmark(mosque.placeId)}
                      aria-label="Remove bookmark"
                      className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    >
                      <BookmarkX className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
