import { Marker } from "react-native-maps";

export const PinnedMarker = ({ location }) => {
    return (
        <Marker
            coordinate={location}
            title="Pin"
            description="Pinned location"
            pinColor="blue"

        />
    );
};