import { WebMaps } from "@/components/maps/web";
import { Header } from "@/components/layouts";

export default function HomePage() {
    return (
        <div className="flex h-full flex-col">
            <Header />
            <main className="relative flex-1 overflow-hidden">
                <WebMaps />
            </main>
        </div>
    );
}
