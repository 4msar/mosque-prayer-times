export const PhotoGallery = ({ photos }: { photos: google.maps.places.Photo[] | undefined }) => {
    if (!photos || photos.length === 0) {
        return null;
    }

    return (
        <div className="flex-no-wrap flex gap-2 overflow-x-auto p-4">
            {photos.map((photo) => (
                <img
                    key={photo.getURI({ maxWidth: 220, maxHeight: 220 })}
                    src={photo.getURI({ maxWidth: 220, maxHeight: 220 })}
                    alt=""
                    loading="lazy"
                    className="aspect-square size-40 rounded-lg object-cover"
                />
            ))}
        </div>
    );
};
