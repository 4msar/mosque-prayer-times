# Mosque Prayer Times - Mobile App Walkthrough

We have successfully rebuilt the "Nearby Mosque Prayer Time finder" web application as a **React Native** cross-platform mobile application using Expo. 

Here is a comprehensive breakdown of the mobile implementation:

## Overview of the New Architecture

This mobile application mirrors the core features of the original PHP/Vue web application but is tailored for iOS and Android environments:

1. **Map & Location**: Uses `expo-location` to grab the device's GPS coordinates and `react-native-maps` to render an interactive map with markers.
2. **Places API Integration**: Replaces the backend proxy with direct client-side requests to the Google Places API to find nearby mosques.
3. **Serverless Database**: Replaces the MySQL database with **Firebase Firestore**, which is ideal for real-time mobile data synchronization and eliminates the need for a dedicated PHP backend.

## 1. Setup & Configuration

To start the project and install all necessary dependencies, we initialized a blank Expo app and installed navigation, maps, and Firebase:

```bash
npx expo install react-native-maps expo-location firebase @react-navigation/native @react-navigation/native-stack
```

The app is dependent on API keys which should be placed in a `.env` file at the root of the project:

```env
# .env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=app_id
```

## 2. Core Components

### Home Screen (`src/screens/HomeScreen.js`)
This is the main entry point of the app:
* **Location Request**: Automatically requests foreground location permission using `Location.requestForegroundPermissionsAsync()`.
* **Google Places Fetching**: Hits the `nearbysearch` endpoint to find places of type `mosque` within a 5km radius.
* **Map Rendering**: Plots the user's location and places a marker (`<Marker>`) for each nearby mosque.
* **Navigation**: Pressing a marker's callout navigates to the details screen, passing the specific `placeId` as a parameter.

### Mosque Details & Prayer Times (`src/screens/MosqueDetailsScreen.js`)
This screen manages the specific prayer time data for a selected mosque:
* **Data Retrieval**: On load, it queries the `mosques` collection in Firestore using the `placeId` as the unique document ID.
* **Conditional Rendering**:
  * **If Data Exists**: Displays the stored prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha, Jummah) and the `lastUpdated` timestamp. It also provides an "Edit Times" button.
  * **If No Data Exists**: Displays an input form allowing the user to provide times for each prayer.
* **Data Persistence**: Uses Firebase `setDoc()` to save or update the prayer times directly to the Firestore database.

### API Services
* **`src/services/googlePlaces.js`**: Contains the logic (`fetchNearbyMosques`) for constructing and executing the REST API call to Google.
* **`src/services/firebaseConfig.js`**: Initializes the Firebase app and exports the `db` (Firestore) reference used by the Details Screen.

## 3. Running the App

To run the application locally on your device or emulator:

1. Ensure your `.env` file is populated with valid Google Maps and Firebase configuration keys.
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. Scan the QR code with the **Expo Go** app on your physical device, or press `a` to run it on an Android Emulator or `i` to run it on an iOS Simulator.

> [!NOTE]
> `react-native-maps` requires a native environment (iOS/Android) to render properly and is not fully supported on the web without additional configuration (`react-native-web-maps`). Therefore, it's recommended to test this app using a mobile emulator or physical device.
