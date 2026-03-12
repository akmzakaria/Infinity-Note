# Building Android App with Capacitor

This guide will help you build the Infinity Note app as an Android application.

## Prerequisites

1. **Node.js and npm** - Already installed
2. **Android Studio** - Download from https://developer.android.com/studio
3. **Java Development Kit (JDK)** - Version 11 or higher
4. **Deployed Web App** - Your app must be deployed to a server (Vercel, etc.)

## Setup Steps

### 1. Update Capacitor Configuration

Edit `capacitor.config.ts` and update the server URL to your deployed app:

```typescript
server: {
  url: 'https://your-actual-vercel-url.vercel.app',
  cleartext: false,
}
```

### 2. Sync Capacitor

Run the sync command to copy web assets and update native projects:

```bash
npm run cap:sync
```

### 3. Open Android Studio

```bash
npm run cap:open
```

This will open the Android project in Android Studio.

## Building the APK

### Option 1: Using Android Studio (Recommended)

1. In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Wait for the build to complete
3. Click "locate" in the notification to find your APK
4. The APK will be in `android/app/build/outputs/apk/debug/app-debug.apk`

### Option 2: Using Command Line

```bash
cd android
./gradlew assembleDebug
```

The APK will be generated at `android/app/build/outputs/apk/debug/app-debug.apk`

## Building Release APK (for Production)

### 1. Generate Signing Key

```bash
keytool -genkey -v -keystore infinity-note-release.keystore -alias infinity-note -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing in Android Studio

1. Go to **Build > Generate Signed Bundle / APK**
2. Select **APK**
3. Choose your keystore file
4. Enter keystore password and key alias
5. Select **release** build variant
6. Click **Finish**

### 3. Or Configure gradle.properties

Create `android/gradle.properties` (if not exists) and add:

```properties
INFINITY_NOTE_RELEASE_STORE_FILE=../infinity-note-release.keystore
INFINITY_NOTE_RELEASE_KEY_ALIAS=infinity-note
INFINITY_NOTE_RELEASE_STORE_PASSWORD=your_store_password
INFINITY_NOTE_RELEASE_KEY_PASSWORD=your_key_password
```

Then build:

```bash
cd android
./gradlew assembleRelease
```

## Development Mode (Local Testing)

For testing with your local development server:

1. Update `capacitor.config.ts`:

```typescript
server: {
  url: 'http://10.0.2.2:3000', // Android emulator
  // or use your computer's IP for physical device
  // url: 'http://192.168.1.XXX:3000',
  cleartext: true,
}
```

2. Start your Next.js dev server:

```bash
npm run dev
```

3. Sync and open Android Studio:

```bash
npm run cap:sync
npm run cap:open
```

4. Run the app in emulator or physical device

## Important Notes

### API Routes Consideration

Since this app uses Next.js API routes, the app MUST connect to a deployed server. The Android app acts as a WebView wrapper that loads your web app.

### Offline Functionality

The app already has offline support through localStorage, so users can:

- Create and edit notes offline
- Sync when they reconnect to the internet

### App Icons and Splash Screen

To customize app icons and splash screen:

1. Install Capacitor Assets plugin:

```bash
npm install @capacitor/assets --save-dev
```

2. Add your icons to `resources/` folder:
   - `icon.png` (1024x1024)
   - `splash.png` (2732x2732)

3. Generate assets:

```bash
npx capacitor-assets generate
```

### Permissions

The app automatically requests necessary permissions. To add more, edit:

- `android/app/src/main/AndroidManifest.xml`

## Troubleshooting

### Build Fails

1. Make sure Android Studio and SDK are properly installed
2. Check Java version: `java -version` (should be 11+)
3. Clean and rebuild:

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### App Shows Blank Screen

1. Check if the server URL in `capacitor.config.ts` is correct
2. Make sure your deployed app is accessible
3. Check Android Logcat in Android Studio for errors

### Network Errors

1. Ensure `android.usesCleartextTraffic="true"` in AndroidManifest.xml for HTTP
2. For HTTPS, make sure SSL certificate is valid

## Publishing to Google Play Store

1. Build a signed release APK (see above)
2. Create a Google Play Developer account ($25 one-time fee)
3. Create a new app in Play Console
4. Upload your APK/AAB
5. Fill in store listing details
6. Submit for review

## Useful Commands

```bash
# Sync web assets to native project
npm run cap:sync

# Open Android Studio
npm run cap:open

# Full build and open
npm run cap:build

# Update Capacitor
npm install @capacitor/cli@latest @capacitor/core@latest @capacitor/android@latest
npx cap sync
```

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
