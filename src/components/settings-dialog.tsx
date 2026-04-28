import { Button } from "@/components/ui/button";
import { Close as DialogClose } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettingsStore } from "@/store/settings-store";
import { Bookmark, MapPin, Settings2, Trash2, ArrowUpDown, Star } from "lucide-react";
import { Link } from "react-router-dom";

const RADIUS_OPTIONS = [500, 1000, 2000, 3000, 5000];

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

      <DialogContent className="max-w-md sm:max-w-lg">
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
                <p className="text-xs text-muted-foreground">
                  Switch between light and dark theme
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
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
                min={500}
                max={5000}
                step={500}
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
                      radius === r ? "font-semibold text-green-600" : ""
                    }`}
                  >
                    {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t" />

            {/* Sort Order */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Sort Results By</Label>
                <p className="text-xs text-muted-foreground">
                  How nearby mosques are ranked
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRankPreference("DISTANCE")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    rankPreference === "DISTANCE"
                      ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Distance
                </button>
                <button
                  type="button"
                  onClick={() => setRankPreference("POPULARITY")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    rankPreference === "POPULARITY"
                      ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <Star className="h-3.5 w-3.5" />
                  Popularity
                </button>
              </div>
            </div>
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
                      <Link
                        to={`/mosque/${mosque.placeId}`}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="truncate text-sm font-medium">
                          {mosque.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {mosque.address}
                        </p>
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
      </DialogContent>
    </Dialog>
  );
}
