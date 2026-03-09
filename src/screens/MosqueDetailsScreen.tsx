import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Alert, Linking } from 'react-native';
import { db } from '../services/firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fetchPlaceDetails } from '../services/googlePlaces';
import dayjs from 'dayjs';
import { MosqueDetailsScreenProps } from '../types';

export default function MosqueDetailsScreen({ route }: MosqueDetailsScreenProps) {
    const { placeId } = route.params;
    const [mosque, setMosque] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataExists, setDataExists] = useState(false);
    const [prayerTimes, setPrayerTimes] = useState({
        fajr: "",
        dhuhr: "",
        asr: "",
        maghrib: "",
        isha: "",
        jummah: "",
        lastUpdated: null,
    });
    const { name = route.params.name, formatted_address: address } = mosque || {};

    useEffect(() => {
        const fetchPrayerTimes = async () => {
            try {
                const docRef = doc(db, 'mosques', placeId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const payload = {
                        ...data.prayerTimes,
                        lastUpdated: data.lastUpdated?.toDate()?.toLocaleDateString?.('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        }) || 'Unknown',
                    };
                    setPrayerTimes(payload);
                    setDataExists(true);
                } else {
                    setDataExists(false);
                }
            } catch (error) {
                console.error("Error fetching prayer times:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaceDetails(placeId).then(result => {
            if (result) {
                setMosque(result);
            }
        })


        fetchPrayerTimes();
    }, [placeId]);

    const handleSave = async () => {
        if (error !== null) {
            Alert.alert('Error', error);
            return;
        }
        try {
            setLoading(true);
            const docRef = doc(db, 'mosques', placeId);

            const mosqueData = {
                name,
                address,
                latitude: mosque.geometry.location.lat || route.params.latitude,
                longitude: mosque.geometry.location.lng || route.params.longitude,
                prayerTimes: {
                    fajr: prayerTimes.fajr,
                    dhuhr: prayerTimes.dhuhr,
                    asr: prayerTimes.asr,
                    maghrib: prayerTimes.maghrib,
                    isha: prayerTimes.isha,
                    jummah: prayerTimes.jummah,
                },
                lastUpdated: new Date()
            };

            await setDoc(docRef, mosqueData);

            setDataExists(true);
            setPrayerTimes((prev) => ({
                ...prev,
                lastUpdated: new Date().toLocaleString()
            }));

            Alert.alert('Success', 'Prayer times saved successfully.');
        } catch (error) {
            console.error("Error saving data:", error);
            Alert.alert('Error', 'Failed to save prayer times.');
        } finally {
            setLoading(false);
        }
    };

    const handleSetValue = (name, value) => {
        const timeRegex = new RegExp('^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$');

        if (timeRegex.test(value)) {
            setError(null);
        } else {
            setError("Invalid time format!");
        }

        setPrayerTimes(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleLinkOpen = () => {
        if (mosque?.url) {
            Linking.openURL(mosque.url).catch(err => console.error("Couldn't load page", err));
        }
    }

    const PrayerDisplay = ({ label, field }: { label: string; field: keyof typeof prayerTimes }) => (
        < View style={styles.displayRow} >
            <Text style={styles.displayLabel}>{label}</Text>
            <Text style={styles.displayValue}>{prayerTimes[field] || 'Not set'}</Text>
        </View >
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading mosque details...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.address}>{address}</Text>

            {dataExists ? (
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Prayer Times</Text>
                    <PrayerDisplay label="Fajr" field="fajr" />
                    <PrayerDisplay label="Dhuhr" field="dhuhr" />
                    <PrayerDisplay label="Asr" field="asr" />
                    <PrayerDisplay label="Maghrib" field="maghrib" />
                    <PrayerDisplay label="Isha" field="isha" />
                    <PrayerDisplay label="Jummah" field="jummah" />

                    <Text style={styles.updatedText}>
                        Last updated: {prayerTimes.lastUpdated}
                    </Text>

                    <TouchableOpacity
                        style={styles.buttonOutline}
                        onPress={() => setDataExists(false)}
                    >
                        <Text style={styles.buttonOutlineText}>Edit Times</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        {prayerTimes.lastUpdated ? 'Update Times' : 'Add Prayer Times'}
                    </Text>

                    <PrayerInput
                        label="Fajr"
                        field="fajr"
                        value={prayerTimes["fajr"]}
                        setValue={handleSetValue}
                    />
                    <PrayerInput
                        label="Dhuhr"
                        field="dhuhr"
                        value={prayerTimes["dhuhr"]}
                        setValue={handleSetValue}
                    />
                    <PrayerInput
                        label="Asr"
                        field="asr"
                        value={prayerTimes["asr"]}
                        setValue={handleSetValue}
                    />
                    <PrayerInput
                        label="Maghrib"
                        field="maghrib"
                        value={prayerTimes["maghrib"]}
                        setValue={handleSetValue}
                    />
                    <PrayerInput
                        label="Isha"
                        field="isha"
                        value={prayerTimes["isha"]}
                        setValue={handleSetValue}
                    />
                    <PrayerInput
                        label="Jummah"
                        field="jummah"
                        value={prayerTimes["jummah"]}
                        setValue={handleSetValue}
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <TouchableOpacity
                        disabled={error !== null}
                        style={styles.button}
                        onPress={handleSave}
                    >
                        <Text style={styles.buttonText}>Save Times</Text>
                    </TouchableOpacity>

                    {prayerTimes.lastUpdated && (
                        <TouchableOpacity
                            style={[styles.buttonOutline, { marginTop: 10 }]}
                            onPress={() => setDataExists(true)}
                        >
                            <Text style={styles.buttonOutlineText}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleLinkOpen}>
                <Text style={styles.buttonText}>Open in Maps</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    address: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    displayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    displayLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#444',
    },
    displayValue: {
        fontSize: 16,
        color: '#0066cc',
        fontWeight: 'bold',
    },
    updatedText: {
        fontSize: 12,
        color: '#888',
        marginTop: 16,
        marginBottom: 16,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    inputContainer
        : {
        display: "flex",
        flexDirection: "row",
        marginBottom: 8,
        width: "100%",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#aaa",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 4,
        paddingLeft: 8,
        paddingRight: 8,
    },
    inputLabel: {
        fontSize: 22,
        fontWeight: '500',
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    button: {
        backgroundColor: '#0066cc',
        padding: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        padding: 14,
        borderRadius: 6,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0066cc',
    },
    buttonOutlineText: {
        color: '#0066cc',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: "red",
        marginTop: 4,
        marginBottom: 4
    }
});

const PrayerInput = ({ label, field, value, setValue }: { label: string; field: string; value: string; setValue: (field: string, text: string) => void }) => {
    const handleTimeChange = (text: string) => {
        setValue(field, text);
    };

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={handleTimeChange}
                placeholder="05:15 AM"
                placeholderTextColor="#999"
            />
        </View>
    );
}
