import { useMosqueStore } from '@/store';
import { APIProvider } from '@vis.gl/react-google-maps';
import { GoogleMap } from './google-map';
import { ItemDetails } from './Item-details';

const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

export const Map = () => {
    const item = useMosqueStore((state) => state.mosque);
    const setItem = useMosqueStore((state) => state.setMosque);

    return (
        <div className="h-full w-full">
            <APIProvider apiKey={API_KEY}>
                <GoogleMap />
            </APIProvider>

            <ItemDetails item={item} onClose={() => setItem(null)} />
        </div>
    );
};
