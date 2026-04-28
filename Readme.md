# Mosque Prayer Times

A Progressive Web App (PWA) to find nearby mosques and view or contribute their prayer times. Built with Vite + React + TypeScript, styled with Tailwind CSS v4 and shadcn/ui, backed by Firebase Firestore.

## Features

- 📍 Browser geolocation to find your current position
- 🗺️ Interactive Google Map showing nearby mosques within 500 m
- 🕌 Tap any mosque marker to view its prayer times
- ✏️ Add or update prayer times (stored in Firebase Firestore)
- 📲 Installable PWA with offline shell support

## Prerequisites

- Node.js 18+
- Yarn
- A [Firebase](https://firebase.google.com/) project with Firestore enabled
- A [Google Cloud](https://console.cloud.google.com/) API key with these APIs enabled:
  - Maps JavaScript API
  - Places API (New)

## Setup

```bash
# 1. Install dependencies
yarn install

# 2. Configure environment variables
cp .env.example .env
# Fill in your Firebase and Google Maps credentials in .env

# 3. Start the dev server
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps / Places API key |

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn preview` | Preview production build locally |

## Firebase Firestore Structure

```
mosques/
  {placeId}/
    name: string
    address: string
    latitude: number
    longitude: number
    lastUpdated: Timestamp
    prayerTimes/
      fajr: string      // e.g. "5:00 AM"
      dhuhr: string
      asr: string
      maghrib: string
      isha: string
      jummah: string
```

## PWA Installation

After opening the app in a supported browser (Chrome, Edge, Safari on iOS), you will see an **Install** prompt. On iOS, use **Share → Add to Home Screen**.

## Tech Stack

- **Vite** – Build tool
- **React 19** + **TypeScript**
- **Tailwind CSS v4** – Utility-first CSS
- **shadcn/ui** – Accessible UI components
- **React Router v7** – Client-side routing
- **@vis.gl/react-google-maps** – Google Maps integration
- **Firebase JS SDK v11** – Firestore backend
- **vite-plugin-pwa** – Service worker & manifest generation
