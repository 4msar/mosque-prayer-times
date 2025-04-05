import { Payload } from '@/hooks';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { KeyedMutator } from 'swr';
import InputError from '../input-error';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export const AddPrayerTimesForm = ({
    item,
    details,
    onUpdate,
    onCancel,
}: {
    details?: Partial<Payload>;
    item: google.maps.places.Place | null;
    onUpdate: KeyedMutator<Payload>;
    onCancel?: () => void;
}) => {
    const { data, setData, errors, post, recentlySuccessful } = useForm({
        name: item?.displayName,
        address: item?.formattedAddress,
        map_url: item?.googleMapsURI,
        latitude: item?.location?.lat(),
        longitude: item?.location?.lng(),

        fajr: '05:00:00',
        dhuhr: '13:15:00',
        asr: '16:30:00',
        maghrib: '18:30:00',
        isha: '20:00:00',
        jummah: '13:30:00',
        sunrise: '06:00:00',
        sunset: '18:20:00',

        ...details,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(`/mosques/${item?.id}`, {
            onSuccess: () => {
                onUpdate();
            },
        });
    };

    const handleCancel = () => {
        onCancel?.();
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold">Add Prayer Times</h2>
            <p className="text-sm text-slate-500">
                Please enter the prayer times for <span className="font-bold">{item?.displayName}</span>.
            </p>
            <form onSubmit={submit} className="mt-4 space-y-6">
                <div className="grid gap-x-2 gap-y-1">
                    <Label htmlFor="fajr">Fajr</Label>

                    <Input
                        id="fajr"
                        className="mt-1 block w-full"
                        value={data.fajr}
                        onChange={(e) => setData('fajr', e.target.value)}
                        placeholder="HH:MM"
                        type="time"
                    />

                    <InputError className="mt-2" message={errors.fajr} />
                </div>
                <div className="grid gap-x-2 gap-y-1">
                    <Label htmlFor="dhuhr">Dhuhr</Label>

                    <Input
                        id="dhuhr"
                        className="mt-1 block w-full"
                        value={data.dhuhr}
                        onChange={(e) => setData('dhuhr', e.target.value)}
                        placeholder="HH:MM"
                        type="time"
                    />

                    <InputError className="mt-2" message={errors.dhuhr} />
                </div>
                <div className="grid gap-x-2 gap-y-1">
                    <Label htmlFor="asr">Asr</Label>
                    <Input
                        id="asr"
                        className="mt-1 block w-full"
                        value={data.asr}
                        onChange={(e) => setData('asr', e.target.value)}
                        placeholder="HH:MM"
                        type="time"
                    />
                    <InputError className="mt-2" message={errors.asr} />
                </div>
                <div className="grid gap-x-2 gap-y-1">
                    <Label htmlFor="maghrib">Maghrib</Label>
                    <Input
                        id="maghrib"
                        className="mt-1 block w-full"
                        value={data.maghrib}
                        onChange={(e) => setData('maghrib', e.target.value)}
                        placeholder="HH:MM"
                        type="time"
                    />
                    <InputError className="mt-2" message={errors.maghrib} />
                </div>
                <div className="grid gap-x-2 gap-y-1">
                    <Label htmlFor="isha">Isha</Label>
                    <Input
                        id="isha"
                        className="mt-1 block w-full"
                        value={data.isha}
                        onChange={(e) => setData('isha', e.target.value)}
                        placeholder="HH:MM"
                        type="time"
                    />
                    <InputError className="mt-2" message={errors.isha} />
                </div>
                <div className="grid gap-x-2 gap-y-1">
                    <Label htmlFor="jummah">Jummah</Label>
                    <Input
                        id="jummah"
                        className="mt-1 block w-full"
                        value={data.jummah}
                        onChange={(e) => setData('jummah', e.target.value)}
                        placeholder="HH:MM"
                        type="time"
                    />
                    <InputError className="mt-2" message={errors.jummah} />
                </div>
                <div className="flex items-center justify-end gap-2">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                        afterLeave={() => handleCancel()}
                    >
                        <p className="text-sm text-neutral-600">Saved</p>
                    </Transition>

                    <Button type="submit" variant="default">
                        Save
                    </Button>
                    <Button variant="destructive" type="button" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};
