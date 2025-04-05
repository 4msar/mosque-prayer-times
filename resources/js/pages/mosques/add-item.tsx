import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mosque } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type FormItem = Pick<Mosque, 'name' | 'address' | 'city' | 'latitude' | 'longitude'>;

export const AddItem = () => {
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<Required<FormItem>>({
        name: '',
        address: '',
        city: '',
        latitude: 0,
        longitude: 0,
    });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('mosques.store'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <div className="absolute right-0 bottom-0 p-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="default">Add New</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Add New Item</DialogTitle>
                    <DialogDescription>
                        To create a new item, please complete the form below. You will be able to add more details later.
                    </DialogDescription>
                    <form className="space-y-6" onSubmit={deleteUser}>
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="sr-only">
                                Name
                            </Label>

                            <Input
                                id="name"
                                type="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Name"
                            />

                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address" className="sr-only">
                                Address
                            </Label>

                            <Input
                                id="address"
                                type="address"
                                name="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Address"
                            />

                            <InputError message={errors.address} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="city" className="sr-only">
                                City
                            </Label>

                            <Input
                                id="city"
                                type="city"
                                name="city"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                placeholder="City"
                            />

                            <InputError message={errors.city} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="latitude" className="sr-only">
                                Latitude
                            </Label>

                            <Input
                                id="latitude"
                                type="latitude"
                                name="latitude"
                                value={data.latitude}
                                onChange={(e) => setData('latitude', e.target.value)}
                                placeholder="Latitude"
                            />

                            <InputError message={errors.latitude} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="longitude" className="sr-only">
                                Longitude
                            </Label>

                            <Input
                                id="longitude"
                                type="longitude"
                                name="longitude"
                                value={data.longitude}
                                onChange={(e) => setData('longitude', e.target.value)}
                                placeholder="Longitude"
                            />

                            <InputError message={errors.longitude} />
                        </div>

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" onClick={closeModal}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button variant="default" disabled={processing} asChild>
                                <button type="submit">Save</button>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
