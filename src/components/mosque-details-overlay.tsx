import { useIsMobile } from "@/hooks/use-mobile";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { MosqueDetailsContent, type MosqueDetailsContentProps } from "./mosque-details-content";

interface MosqueDetailsOverlayProps extends MosqueDetailsContentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MosqueDetailsOverlay({
    open,
    onOpenChange,
    placeId,
    initialName,
    initialAddress,
    initialLatitude,
    initialLongitude,
}: MosqueDetailsOverlayProps) {
    const isMobile = useIsMobile();

    const content = (
        <MosqueDetailsContent
            placeId={placeId}
            initialName={initialName}
            initialAddress={initialAddress}
            initialLatitude={initialLatitude}
            initialLongitude={initialLongitude}
        />
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="max-h-[90svh]">
                    <DrawerHeader className="sr-only">
                        <DrawerTitle>{initialName ?? "Mosque Details"}</DrawerTitle>
                        <DrawerDescription>Prayer times and mosque information</DrawerDescription>
                    </DrawerHeader>
                    <div className="overflow-y-auto px-4 pb-6 pt-2">{content}</div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto p-5">
                <DialogHeader className="sr-only">
                    <DialogTitle>{initialName ?? "Mosque Details"}</DialogTitle>
                    <DialogDescription>Prayer times and mosque information</DialogDescription>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    );
}
