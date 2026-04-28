import { MapPin } from "lucide-react";
import { WebMaps } from "@/components/maps/web";

export default function HomePage() {
    return (
        <div className="flex h-full flex-col">
            <header className="flex items-center gap-2 border-b bg-white px-4 py-3 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                    <MapPin className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900">Nearby Mosques</h1>
            </header>
            <main className="relative flex-1 overflow-hidden">
                <WebMaps />
            </main>
        </div>
    );
}
