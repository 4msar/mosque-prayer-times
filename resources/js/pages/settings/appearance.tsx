import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';

import AppLayout from '@/layouts/web-layout';

export default function Appearance() {
    return (
        <AppLayout>
            <Head title="Appearance settings" />

            <div className="container mx-auto space-y-6 px-4 py-6">
                <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                <AppearanceTabs />
            </div>
        </AppLayout>
    );
}
