import { ErrorBoundary } from '@/components/error-boundary';
import { Map } from '@/components/map';
import AppLayout from '@/layouts/web-layout';
import { Mosque, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Mosques() {
    const page = usePage<
        SharedData & {
            mosques: Mosque[];
            filters: Record<string, string>;
        }
    >();

    const { mosques, filters } = page.props;

    return (
        <AppLayout>
            <Head title="Home" />
            <ErrorBoundary>
                <Map mosques={mosques} filters={filters} />
            </ErrorBoundary>

            {/* <AddItem /> */}
        </AppLayout>
    );
}
