import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MosqueDetailsContent } from "@/components/mosque-details-content";

export default function MosqueDetailsPage() {
    const { placeId } = useParams<{ placeId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const routeState = location.state as {
        name?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
    } | null;

    if (!placeId) return null;

    return (
        <div className="flex h-full flex-col bg-slate-50">
            <header className="flex items-center gap-3 border-b bg-white px-4 py-3 shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="shrink-0"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="truncate text-base font-semibold text-gray-900">
                    {routeState?.name ?? "Mosque Details"}
                </h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4">
                <MosqueDetailsContent
                    placeId={placeId}
                    initialName={routeState?.name}
                    initialAddress={routeState?.address}
                    initialLatitude={routeState?.latitude}
                    initialLongitude={routeState?.longitude}
                />
            </div>
        </div>
    );
}
