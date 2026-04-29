import { Home, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export const Footer = ({ placeId }: { placeId: string }) => {
  return (
    <footer className="flex items-center justify-center gap-2 border-t border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <Button size="sm" variant="default" asChild>
        <Link to="/">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      <Button size="sm" variant="secondary" asChild>
        <Link to={`/?placeId=${placeId}`}>
          <MapPin className="h-4 w-4" />
          View on Map
        </Link>
      </Button>
    </footer>
  );
};
