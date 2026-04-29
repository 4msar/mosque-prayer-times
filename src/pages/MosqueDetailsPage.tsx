import { Footer, Header } from '@/components/layouts';
import { MosqueDetailsContent } from '@/components/mosque-details-content';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export default function MosqueDetailsPage() {
  useMapsLibrary('maps');
  const { placeId } = useParams<{ placeId: string }>();
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
      <Header mosqueDetailsPage={true} />

      <div className="flex-1 overflow-y-auto mx-auto w-full max-w-2xl p-4">
        <MosqueDetailsContent
          placeId={placeId}
          initialName={routeState?.name}
          initialAddress={routeState?.address}
          initialLatitude={routeState?.latitude}
          initialLongitude={routeState?.longitude}
        />
      </div>

      <Footer placeId={placeId} />
    </div>
  );
}
