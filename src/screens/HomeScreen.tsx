import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { MobileMaps, WebMaps } from "../components/maps";
import { APIProvider } from "@vis.gl/react-google-maps";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            {Platform.OS === "web" ? (
                <APIProvider apiKey={API_KEY}>
                    <WebMaps />
                </APIProvider>
            ) : (
                <MobileMaps />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
