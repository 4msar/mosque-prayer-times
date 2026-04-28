import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Toaster } from '@/components/ui/sonner';
import HomePage from '@/pages/HomePage';
import MosqueDetailsPage from '@/pages/MosqueDetailsPage';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

export default function App() {
  return (
    <APIProvider apiKey={API_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mosque/:placeId" element={<MosqueDetailsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-center" />
    </APIProvider>
  );
}
