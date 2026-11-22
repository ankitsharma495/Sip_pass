# Sip Pass — Frontend (React Native & Expo)

Mobile client for **Sip Pass** coffee subscription app, built with Expo SDK 58, React Native, and TypeScript according to Stitch design specifications.

## Stack
- **Framework**: React Native 0.81.5 with Expo SDK 58
- **Language**: TypeScript (strict mode)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Fonts**: `@expo-google-fonts/plus-jakarta-sans`, `@expo-google-fonts/rubik`
- **Safe Area**: `react-native-safe-area-context`

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npx expo start
```
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Press `w` to open in Web Browser
- Scan QR code with the **Expo Go** app on iOS / Android physical devices

---

## Configuration & API Connection

The API client in `src/services/api.ts` connects to the NestJS backend:
```ts
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api/v1', // Android emulator host loopback
  ios: 'http://localhost:3000/api/v1',     // iOS simulator
  default: 'http://localhost:3000/api/v1',
});
```
For production builds or testing on physical devices, set your hosted backend API URL (e.g. `https://api.sippass.in/api/v1`).

---

## Production Deployment & Builds

### Option A: Expo Application Services (EAS Build)
Deploy native `.apk` / `.aab` for Google Play and `.ipa` for Apple App Store:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Login to your Expo account:
   ```bash
   eas login
   ```
3. Configure project:
   ```bash
   eas build:configure
   ```
4. Build for Android & iOS:
   ```bash
   eas build --platform android --profile production
   eas build --platform ios --profile production
   ```
5. Submit to App Stores:
   ```bash
   eas submit --platform all
   ```

### Option B: Static Web Deployment
```bash
npx expo export -p web
```
Deploys `dist/` to Vercel, Netlify, or Cloudflare Pages.
