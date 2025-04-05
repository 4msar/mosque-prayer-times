import { ErrorBoundary } from '@/components/error-boundary';
import { Map } from '@/components/map';
import AppLayout from '@/layouts/web-layout';
import { Head } from '@inertiajs/react';

export default function Mosques() {
    return (
        <AppLayout>
            <Head title="Home" />
            <ErrorBoundary>
                <Map />
            </ErrorBoundary>

            {/* <AddItem /> */}
        </AppLayout>
    );
}
