import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MosqueDetailsContentProps } from "@/types";
import dayjs from "dayjs";
import {
    ExternalLink,
    MapPin,
    Phone,
    Star
} from "lucide-react";


export const MosqueHeaderBanner = ({
  mosqueDetails,
  initialDetails,
}: {
  mosqueDetails: google.maps.places.Place;
  initialDetails: Partial<MosqueDetailsContentProps>;
}) => {
  const mosqueName = mosqueDetails.displayName ?? initialDetails.initialName;
  const mosqueAddress =
    mosqueDetails.formattedAddress ?? initialDetails.initialAddress;
  const openNow = mosqueDetails.currentOpeningHours?.periods.some(period => period.open.day === dayjs().day()) ?? false;
  const rating = mosqueDetails.rating ?? undefined;
  const totalRatings = mosqueDetails.userRatingCount ?? undefined;
  const mapsUrl = mosqueDetails.googleMapsURI ?? undefined;
  const phone = mosqueDetails.nationalPhoneNumber ?? undefined;

  return (
    <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-green-600 to-green-800 px-5 py-5 text-white">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-4 h-20 w-20 rounded-full bg-white/5" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold leading-tight">{mosqueName}</h2>
          {mosqueAddress && (
            <p className="mt-1 flex items-start gap-1.5 text-xs text-green-100">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-2">{mosqueAddress}</span>
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {openNow !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  openNow
                    ? "bg-green-400/30 text-green-50"
                    : "bg-red-400/30 text-red-100",
                )}
              >
                {openNow ? "● Open now" : "● Closed"}
              </span>
            )}
            {rating !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                {rating.toFixed(1)}
                {totalRatings && (
                  <span className="text-white/70">
                    ({totalRatings.toLocaleString()})
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-3xl select-none">🕌</div>
      </div>

      {/* Action buttons */}
      <div className="relative mt-4 flex gap-2">
        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              variant="secondary"
              className="gap-1.5 bg-white/20 text-white hover:bg-white/30 border-0"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Google Maps
            </Button>
          </a>
        )}
        {phone && (
          <a href={`tel:${phone}`}>
            <Button
              size="sm"
              variant="secondary"
              className="gap-1.5 bg-white/20 text-white hover:bg-white/30 border-0"
            >
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};
