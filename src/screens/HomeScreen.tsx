import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { fetchNearbyMosques } from '../services/googlePlaces';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import markerIcon from '../../assets/marker.png';
import { RootStackParamList } from '../types';

const defaultLocation = {
    // Bangladesh
    latitude: 23.7706621,
    longitude: 90.3751423,
}

export default function HomeScreen() {
    const [location, setLocation] = useState(defaultLocation);
    const [userLocation, setUserLocation] = useState(null);
    const [mosques, setMosques] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const mapRef = useRef<MapView>(null);

    const handleMapOnPress = (evt) => {
        if (evt.nativeEvent.action === 'marker-press') {
            return;
        }

        setLocation(evt.nativeEvent.coordinate);
    };

    const getAndSetUserLocation = (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            setLoading(false);
            return;
        }

        let loc = await Location.getCurrentPositionAsync({});

        setUserLocation(loc.coords)
        const nearbyMosques = await fetchNearbyMosques(loc.coords.latitude, loc.coords.longitude);
        setMosques(nearbyMosques);

        setLoading(false);

        if (mapRef.current?.fitToCoordinates) {
            mapRef.current?.fitToElements();
        }
    })

    useEffect(() => {
        getAndSetUserLocation();
    }, []);

    useEffect(() => {
        if (!location) return;

        (async () => {
            const nearbyMosques = await fetchNearbyMosques(location.latitude, location.longitude);
            setMosques(nearbyMosques);
        })();
    }, [location]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Finding nearby mosques...</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.center}>
                <Text>Location not available.</Text>
            </View>
        );
    }

    const initialRegion = {
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude,
        latitudeDelta: 0.8,
        longitudeDelta: 0.8,
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_DEFAULT}
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                onLongPress={handleMapOnPress}
                followsUserLocation
                zoomEnabled
                showsCompass
            >
                {mosques.map((mosque) => (
                    <Marker
                        key={mosque.place_id}
                        coordinate={{
                            latitude: mosque.geometry.location.lat,
                            longitude: mosque.geometry.location.lng,
                        }}
                        image={markerIcon}
                        title={mosque.name}
                        description={mosque.vicinity || mosque.plus_code.compound_code || ""}
                        onCalloutPress={() => {
                            navigation.navigate('MosqueDetails', {
                                placeId: mosque.place_id,
                                name: mosque.name,
                                address: mosque.vicinity,
                                latitude: mosque.geometry.location.lat,
                                longitude: mosque.geometry.location.lng
                            });
                        }}
                    />
                ))}

                {location && <Marker
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }}
                    title="Pin"
                    description="Pinned location"
                />}
            </MapView>

            <FloatingButton
                onPress={() => {
                    getAndSetUserLocation()
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#22ad65ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const FloatingButton = ({ onPress }) => {
    return (
        <TouchableOpacity
            style={styles.floatingButton}
            onPress={onPress}
        >
            <Text style={{
                color: '#fff',
                fontSize: 32,
                transform: 'rotate(-45deg)'
            }}>
                ➤
            </Text>
        </TouchableOpacity>
    );
};