# Simple Android App Build Guide

## ❗ IMPORTANT: You Need Android Studio First!

The `build-android.bat` command won't work without Android Studio installed.

## Step-by-Step Setup

### 1. Install Android Studio (Required!)

**Download:** https://developer.android.com/studio

**Installation Steps:**

1. Download Android Studio from the link above
2. Run the installer
3. Follow the setup wizard
4. Install Android SDK (it will prompt you)
5. Wait for all components to download (this takes 10-20 minutes)

**What to install in Android Studio:**

- ✅ Android SDK
- ✅ Android SDK Platform
- ✅ Android Virtual Device (for testing)

### 2. Verify Installation

After installing Android Studio, restart your computer, then check:

```bash
# Check if Android Studio is installed
where.exe studio64.exe
```

### 3. Update Capacitor Config

Before building, you MUST update `capacitor.config.ts` with your deployed app URL:

```typescript
server: {
  url: 'https://your-actual-vercel-url.vercel.app',
  cleartext: false,
}
```

**Where to get your Vercel URL:**

1. Go to https://vercel.com
2. Find your deployed project
3. Copy the production URL
4. Paste it in the config above

### 4. Build the App

Once Android Studio is installed, run these commands one by one:

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Build your Next.js app
npm run build

# 3. Sync with Android
npx cap sync android

# 4. Open Android Studio
npx cap open android
```

### 5. In Android Studio

Once Android Studio opens:

1. **Wait for Gradle sync** (bottom right corner - this takes a few minutes first time)
2. Click **Build** menu → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build to complete (5-10 minutes first time)
4. Click **locate** in the notification
5. Your APK is ready! It's in: `android/app/build/outputs/apk/debug/app-debug.apk`

### 6. Install on Your Phone

**Option A: USB Cable**

1. Enable Developer Options on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"
2. Connect phone to computer
3. In Android Studio, click the green "Run" button
4. Select your device

**Option B: Transfer APK**

1. Copy `app-debug.apk` to your phone
2. Open the file on your phone
3. Allow installation from unknown sources if prompted
4. Install the app

## Alternative: Build Without Android Studio (Advanced)

If you want to build without opening Android Studio GUI:

### Requirements:

- Android SDK Command Line Tools
- Java JDK 11+
- Gradle

### Commands:

```bash
# Navigate to android folder
cd android

# Build debug APK
gradlew.bat assembleDebug

# APK will be in: app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting

### "build-android.bat not working"

- **Cause:** Android Studio not installed
- **Solution:** Install Android Studio first (see Step 1)

### "npx cap open android" does nothing

- **Cause:** Android Studio not in PATH
- **Solution:**
  1. Find Android Studio installation (usually `C:\Program Files\Android\Android Studio\bin\studio64.exe`)
  2. Open it manually
  3. Open the `android` folder from your project

### "Gradle sync failed"

- **Cause:** First time setup or missing SDK
- **Solution:**
  1. In Android Studio, go to Tools → SDK Manager
  2. Install Android SDK Platform 33 (or latest)
  3. Click "Sync Project with Gradle Files"

### "App shows blank screen"

- **Cause:** Wrong server URL or app not deployed
- **Solution:**
  1. Make sure your app is deployed to Vercel
  2. Update `capacitor.config.ts` with correct URL
  3. Run `npx cap sync android` again
  4. Rebuild

## Quick Commands Reference

```bash
# Sync changes to Android
npx cap sync android

# Open Android Studio
npx cap open android

# Update Capacitor
npm install @capacitor/cli@latest @capacitor/core@latest @capacitor/android@latest
npx cap sync
```

## What You're Building

Your Android app is a **native wrapper** around your web app. This means:

- ✅ The app loads your deployed website
- ✅ All features work (login, notes, sync, etc.)
- ✅ Works offline (localStorage)
- ✅ Looks and feels like a native app
- ✅ Can be published to Google Play Store

## Timeline

- **Android Studio Download:** 5-10 minutes
- **Android Studio Installation:** 10-20 minutes
- **First Build:** 10-15 minutes
- **Subsequent Builds:** 2-5 minutes

## Need Help?

1. Make sure Android Studio is fully installed
2. Make sure your app is deployed to Vercel
3. Update the URL in `capacitor.config.ts`
4. Run the commands in order
5. Wait for Gradle sync to complete

## Summary

**You CANNOT build Android app without Android Studio!**

1. ⬇️ Download & Install Android Studio
2. 🔄 Update `capacitor.config.ts` with your Vercel URL
3. ▶️ Run: `npx cap sync android`
4. 📱 Run: `npx cap open android`
5. 🔨 Build APK in Android Studio
6. 📲 Install on your phone

That's it! Once Android Studio is installed, the process is straightforward.
