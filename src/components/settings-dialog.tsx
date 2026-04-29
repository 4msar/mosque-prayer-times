import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ALADHAN_METHODS, ALADHAN_SCHOOLS } from '@/services/aladhan';
import { useSettingsStore } from '@/store/settings-store';
import { Close as DialogClose } from '@radix-ui/react-dialog';
import { ArrowUpDown, Bookmark, Clock, MapPin, Settings2, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const RADIUS_OPTIONS = [100, 500, 1000, 2000];

export function SettingsDialog() {
  const {
    radius,
    setRadius,
    rankPreference,
    setRankPreference,
    darkMode,
    setDarkMode,
    bookmarks,
    removeBookmark,
    setLocationFromMap,
    aladhan,
    setAladhan,
  } = useSettingsStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Settings"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Settings2 className="h-4 w-4" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-1">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1 gap-1.5">
              <Settings2 className="h-3.5 w-3.5" />
              General
            </TabsTrigger>
            <TabsTrigger value="prayer-times" className="flex-1 gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Prayer Times
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex-1 gap-1.5">
              <Bookmark className="h-3.5 w-3.5" />
              Bookmarks
              {bookmarks.length > 0 && (
                <span className="ml-0.5 rounded-full bg-green-600 px-1.5 py-0 text-[10px] font-semibold text-white leading-4">
                  {bookmarks.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6 pt-4">
            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-sm font-medium">
                  Dark Mode
                </Label>
                <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="border-t" />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="set-location-from-map" className="text-sm font-medium">
                  Set location from map
                </Label>
                <p className="text-xs text-muted-foreground">Set location from the map</p>
              </div>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLocationFromMap(true)}
                  className="border"
                >
                  <MapPin className="h-4 w-4 text-green-600" />
                </Button>
              </DialogClose>
            </div>

            <div className="border-t" />

            {/* Search Radius */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Search Radius</Label>
                  <p className="text-xs text-muted-foreground">
                    Distance to search for nearby mosques
                  </p>
                </div>
                <span className="rounded-md bg-green-50 px-2 py-0.5 text-sm font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                  {radius >= 1000 ? `${radius / 1000} km` : `${radius} m`}
                </span>
              </div>

              <Slider
                min={100}
                max={2000}
                step={100}
                value={[radius]}
                onValueChange={([v]) => setRadius(v)}
                className="w-full"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadius(r)}
                    className={`rounded px-1 py-0.5 transition-colors hover:text-foreground ${
                      radius === r ? 'font-semibold text-green-600' : ''
                    }`}
                  >
                    {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                  </button>
                ))}
              </div>

              <p className="text-xs italic text-muted-foreground">
                Max search result count is 20, and the radius is the distance from your location.
              </p>
            </div>

            <div className="border-t" />

            {/* Sort Order */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Sort Results By</Label>
                <p className="text-xs text-muted-foreground">How nearby mosques are ranked</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRankPreference('DISTANCE')}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    rankPreference === 'DISTANCE'
                      ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Distance
                </button>
                <button
                  type="button"
                  onClick={() => setRankPreference('POPULARITY')}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    rankPreference === 'POPULARITY'
                      ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <Star className="h-3.5 w-3.5" />
                  Popularity
                </button>
              </div>
            </div>
          </TabsContent>

          {/* Prayer Times Tab */}
          <TabsContent value="prayer-times" className="space-y-5 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="aladhan-enabled" className="text-sm font-medium">
                  Use AlAdhan API
                </Label>
                <p className="text-xs text-muted-foreground">
                  Show prayer times from AlAdhan.com when no times are saved
                </p>
              </div>
              <Switch
                id="aladhan-enabled"
                checked={aladhan.enabled}
                onCheckedChange={(checked) => setAladhan({ enabled: checked })}
              />
            </div>

            {aladhan.enabled && (
              <>
                <div className="border-t" />

                <div className="rounded-lg border border-green-100 bg-green-50/50 p-3 dark:border-green-900 dark:bg-green-950/20">
                  <p className="text-xs text-green-700 dark:text-green-400">
                    Prayer times will be fetched from{' '}
                    <a
                      href="https://aladhan.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                    >
                      AlAdhan.com
                    </a>{' '}
                    based on your current location when no saved times exist for a mosque.
                  </p>
                </div>

                {/* Calculation Method */}
                <div className="space-y-2">
                  <Label htmlFor="aladhan-method" className="text-sm font-medium">
                    Calculation Method
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Islamic authority used for prayer time calculations
                  </p>
                  <Select
                    value={String(aladhan.method)}
                    onValueChange={(val) => setAladhan({ method: Number(val) })}
                  >
                    <SelectTrigger id="aladhan-method" className="w-full">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {ALADHAN_METHODS.map((m) => (
                        <SelectItem key={m.value} value={String(m.value)}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* School / Madhab */}
                <div className="space-y-2">
                  <Label htmlFor="aladhan-school" className="text-sm font-medium">
                    Juristic School (Asr)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Determines Asr prayer time calculation
                  </p>
                  <Select
                    value={String(aladhan.school)}
                    onValueChange={(val) => setAladhan({ school: Number(val) })}
                  >
                    <SelectTrigger id="aladhan-school" className="w-full">
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALADHAN_SCHOOLS.map((s) => (
                        <SelectItem key={s.value} value={String(s.value)}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks" className="pt-4">
            {bookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
                <Bookmark className="h-10 w-10 opacity-30" />
                <p className="text-sm font-medium">No bookmarks yet</p>
                <p className="max-w-[220px] text-xs">
                  Open a mosque and tap the bookmark icon to save it here.
                </p>
              </div>
            ) : (
              <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {bookmarks.map((mosque) => (
                  <li
                    key={mosque.placeId}
                    className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <DialogClose asChild>
                      <Link to={`/mosque/${mosque.placeId}`} className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-medium whitespace-break-spaces">{mosque.name}</p>
                        <p className="truncate text-xs text-muted-foreground whitespace-break-spaces">{mosque.address}</p>
                      </Link>
                    </DialogClose>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-destructive hover:bg-destructive/10"
                      onClick={() => removeBookmark(mosque.placeId)}
                      aria-label="Remove bookmark"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t pt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <DialogClose asChild>
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
          </DialogClose>
          <span aria-hidden="true">&middot;</span>
          <DialogClose asChild>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </DialogClose>
          <span aria-hidden="true">&middot;</span>
          <DialogClose asChild>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
