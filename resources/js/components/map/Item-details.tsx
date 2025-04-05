import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { useIsMobile } from '@/hooks';
import { useEffect } from 'react';
import { Button } from '../ui/button';
import { PrayerTime } from './prayer-time';

export const ItemDetails = ({ item, onClose }: { item: google.maps.places.Place | null; onClose: () => void }) => {
    const isMobile = useIsMobile();
    useEffect(() => {
        if (item?.id) {
            // Fetch additional details if needed
            console.log(item.toJSON());
        }
    }, [item]);

    return (
        <Sheet open={!!item} onOpenChange={onClose}>
            <SheetContent side={isMobile ? 'bottom' : 'right'}>
                <SheetHeader>
                    <SheetTitle>{item?.displayName}</SheetTitle>
                    <SheetDescription className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span>{item?.formattedAddress}</span>
                            {item?.nationalPhoneNumber && (
                                <>
                                    <br />
                                    <a className="font-semibold text-blue-900 underline" href={`tel:${item?.nationalPhoneNumber}`}>
                                        {item?.nationalPhoneNumber}
                                    </a>
                                </>
                            )}
                        </div>
                        {item?.googleMapsURI && (
                            <Button size="sm" variant="destructive" type="button">
                                <a href={item?.googleMapsURI} target="_blank" rel="noopener noreferrer">
                                    Open in Google Maps
                                </a>
                            </Button>
                        )}
                    </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                    <div className="flex flex-wrap items-center justify-evenly gap-2 border-t border-slate-200 p-4">
                        <PrayerTime name="Fajr" time="05:10 AM" />
                        <PrayerTime name="Dhuhr" time="01:10 AM" />
                        <PrayerTime name="Asr" time="05:00 PM" />
                        <PrayerTime name="Maghrib" time="06:30 PM" />
                        <PrayerTime name="Esha" time="08:30 PM" />
                    </div>

                    {/* <SheetClose>
                        <Button variant="outline">Cancel</Button>
                    </SheetClose> */}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
