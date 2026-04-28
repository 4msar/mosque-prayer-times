import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MosqueDetailsContent } from '@/components/mosque-details-content';
import { SettingsDialog } from '@/components/settings-dialog';
import { Footer } from '@/components/layouts';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

export default function MosqueDetailsPage() {
  useMapsLibrary('maps');
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as {
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  } | null;

  useEffect(() => {
    document.title = `${routeState?.name ?? 'Mosque Details'} - Prayer Times`;
  }, [routeState?.name]);

  if (!placeId) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 dark:bg-gray-950">
      <header className="flex items-center sticky top-0 z-10 gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
          {routeState?.name ?? 'Mosque Details'}
        </h1>

        <div className="ml-auto">
          <SettingsDialog />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto mx-auto w-full max-w-2xl p-4">
        <MosqueDetailsContent
          placeId={placeId}
          initialName={routeState?.name}
          initialAddress={routeState?.address}
          initialLatitude={routeState?.latitude}
          initialLongitude={routeState?.longitude}
        />
      </div>

      <Footer />
    </div>
  );
}
