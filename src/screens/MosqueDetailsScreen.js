import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Alert, Linking } from 'react-native';
import { db } from '../services/firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fetchPlaceDetails } from '../services/googlePlaces';

export default function MosqueDetailsScreen({ route }) {
    const { placeId } = route.params;
    const [mosque, setMosque] = useState({});
    const [loading, setLoading] = useState(true);
    const [dataExists, setDataExists] = useState(false);
    const [prayerTimes, setPrayerTimes] = useState({
        fajr: new Date(),
        dhuhr: new Date(),
        asr: new Date(),
        maghrib: new Date(),
        isha: new Date(),
        jummah: new Date(),
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
                        fajr: parseTimeToDate(data.prayerTimes.fajr),
                        dhuhr: parseTimeToDate(data.prayerTimes.dhuhr),
                        asr: parseTimeToDate(data.prayerTimes.asr),
                        maghrib: parseTimeToDate(data.prayerTimes.maghrib),
                        isha: parseTimeToDate(data.prayerTimes.isha),
                        jummah: parseTimeToDate(data.prayerTimes.jummah),
                        lastUpdated: data.lastUpdated?.toDate().toLocaleString() || 'Unknown',
                    };
                    console.log({ payload })
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
        try {
            setLoading(true);
            const docRef = doc(db, 'mosques', placeId);

            const mosqueData = {
                name,
                address,
                latitude: mosque.geometry.location.lat || route.params.latitude,
                longitude: mosque.geometry.location.lng || route.params.longitude,
                prayerTimes: {
                    fajr: formatTime(prayerTimes.fajr),
                    dhuhr: formatTime(prayerTimes.dhuhr),
                    asr: formatTime(prayerTimes.asr),
                    maghrib: formatTime(prayerTimes.maghrib),
                    isha: formatTime(prayerTimes.isha),
                    jummah: formatTime(prayerTimes.jummah),
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
        setPrayerTimes(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleLinkOpen = () => {
        if (mosque.url) {
            Linking.openURL(mosque.url).catch(err => console.error("Couldn't load page", err));
        }
    }

    const PrayerDisplay = ({ label, field }) => (
        <View style={styles.displayRow}>
            <Text style={styles.displayLabel}>{label}</Text>
            <Text style={styles.displayValue}>{formatTime(prayerTimes[field]) || 'Not set'}</Text>
        </View>
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

                    <TouchableOpacity style={styles.button} onPress={handleSave}>
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
});


const formatTime = (date) => {
    try {
        if (typeof date === 'string') {
            const dateIns = parseTimeToDate(date);
            return dayjs(dateIns).format("h:mm A");
        }
        return dayjs(date).format("h:mm A");
    } catch (e) {
        return ""
    }
}

const parseTimeToDate = (time) => {
    try {
        const date = dayjs(time, "h:mm A");
        return date.toDate();
    } catch (e) {
        return new Date();
    }
}

const PrayerInput = ({ label, field, value, setValue }) => {

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <DateTimePicker
                mode='time'
                is24Hour={false}
                value={new Date(value)}
                onChange={(event, date) => {
                    if (date) {
                        setValue(field, date)
                    }
                }}
                style={{
                    flex: 1,
                }}
            />
        </View>
    );
}
