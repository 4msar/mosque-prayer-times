import { WebMaps } from '@/components/maps/web';
import { Header } from '@/components/layouts';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

export default function HomePage() {
  useMapsLibrary('maps');
  return (
    <div className="flex h-dvh min-h-dvh flex-col">
      <Header />
      <WebMaps />
    </div>
  );
}
