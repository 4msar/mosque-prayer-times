/**
 * Web stub for react-native-maps.
 * react-native-maps uses native-only APIs (codegenNativeComponent) that do not
 * exist in the browser. This stub renders a placeholder so the web build works.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const PROVIDER_GOOGLE = "google";
export const PROVIDER_DEFAULT = null;

export const Marker = (_props: any) => null;
export const Callout = (_props: any) => null;
export const Polyline = (_props: any) => null;
export const Polygon = (_props: any) => null;
export const Circle = (_props: any) => null;

const MapView = ({ style, children }: any) => (
    <View style={[styles.container, style]}>
        <Text style={styles.label}>Map not available on web</Text>
        {children}
    </View>
);

MapView.Marker = Marker;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#d1d5db",
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        color: "#6b7280",
        fontSize: 16,
    },
});

export default MapView;
