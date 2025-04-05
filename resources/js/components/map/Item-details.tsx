import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { useGetPrayerTimes, useIsMobile } from '@/hooks';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { AddPrayerTimesForm } from './add-prayer-time-form';
import { PhotoGallery } from './photo-gallery';
import { ShowPrayerTime } from './show-prayer-time';

export const ItemDetails = ({ item, onClose }: { item: google.maps.places.Place | null; onClose: () => void }) => {
    const isMobile = useIsMobile();
    const [viewPhotos, setViewPhotos] = useState(false);
    const [edit, setEdit] = useState(false);

    const { data: mosqueDetails, isLoading, mutate } = useGetPrayerTimes(item);

    return (
        <Sheet open={!!item} onOpenChange={onClose}>
            <SheetContent
                hideCloseButton
                onInteractOutside={() => {}}
                side={isMobile ? 'bottom' : 'right'}
                className="h-full w-full overflow-auto sm:max-w-md"
            >
                <SheetHeader className="sticky top-0 z-10 flex flex-row items-start justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-zinc-900">
                    <div>
                        <SheetTitle>{item?.displayName}</SheetTitle>
                        <SheetDescription className="flex flex-wrap items-center justify-between gap-2">
                            <span>
                                <span>{item?.formattedAddress}</span>
                                {item?.nationalPhoneNumber && (
                                    <>
                                        <br />
                                        <a className="font-semibold text-blue-900 underline" href={`tel:${item?.nationalPhoneNumber}`}>
                                            {item?.nationalPhoneNumber}
                                        </a>
                                    </>
                                )}
                            </span>
                        </SheetDescription>
                        {item?.googleMapsURI && (
                            <Button variant="destructive" type="button" className="mt-2 w-auto">
                                <a href={item?.googleMapsURI} target="_blank" rel="noopener noreferrer">
                                    Open in Google Maps
                                </a>
                            </Button>
                        )}
                    </div>
                    <SheetClose asChild>
                        <Button size="icon" variant="destructive" type="button">
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </SheetClose>
                </SheetHeader>

                {mosqueDetails && !edit ? (
                    <>
                        <ShowPrayerTime isLoading={isLoading} item={item} details={mosqueDetails} />
                        <div className="flex flex-wrap items-center justify-end gap-2 p-4">
                            <Button variant="outline" onClick={() => setEdit(true)}>
                                Edit Prayer Times
                            </Button>
                            <Button className="hover:bg-gray-800" variant="secondary" onClick={() => setViewPhotos((p) => !p)}>
                                {viewPhotos ? 'Hide Photos' : 'View Photos'}
                            </Button>
                        </div>
                    </>
                ) : (
                    <AddPrayerTimesForm onUpdate={mutate} details={mosqueDetails} item={item} onCancel={() => setEdit(false)} />
                )}

                {viewPhotos && (
                    <SheetFooter className="border-t border-slate-200 p-4">
                        <PhotoGallery photos={item?.photos} />
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
};
