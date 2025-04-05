import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';

export const createGpsMarker = (coordinates: number[]) => {
    const iconFeature = new Feature({
        geometry: new Point(fromLonLat(coordinates)),
    });

    const iconStyle = new Style({
        image: new Icon({
            anchor: [0.5, 1],
            src: '/images/gps.svg',
            scale: 0.05,
        }),
    });

    iconFeature.setStyle(iconStyle);

    return iconFeature;
};

export const addFeatures = (items: any[], map: any) => {
    items.forEach((item) => {
        const coordinates = [item.longitude, item.latitude];
        const iconFeature = createGpsMarker(coordinates);
        map.addLayer(iconFeature);
    });
};
