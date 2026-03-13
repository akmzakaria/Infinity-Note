# 🔥 Complete Firebase Android Setup Guide

## Current Issue: Google Sign-In Not Working in Android App

The Firebase authentication works on web but not in your Android app. This is because Firebase needs Android-specific configuration.

## Step-by-Step Solution

### Step 1: Add Android App to Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project** (akm-skillverse or your project name)
3. **Click the gear icon** ⚙️ next to "Project Overview"
4. **Click "Project settings"**
5. **Scroll down to "Your apps" section**
6. **Click the Android icon** (🤖) to add Android app

### Step 2: Configure Android App

**Fill in the registration form:**

- **Android package name**: `com.infinitynote.app`
  (This MUST match exactly what's in your `capacitor.config.ts`)
- **App nickname (optional)**: `Infinity Note Android`
- **Debug signing certificate SHA-1**: Leave blank for now (we'll add this later)

**Click "Register app"**

### Step 3: Download google-services.json

1. **Click "Download google-services.json"**
2. **Save the file** to your computer
3. **IMPORTANT**: Place this file in the correct location:
   ```
   android/app/google-services.json
   ```
   (Must be in the `android/app/` folder, NOT the root!)

### Step 4: Get SHA-1 Fingerprint

This is **REQUIRED** for Google Sign-In to work.

#### Method 1: Using Android Studio (Easiest)

1. **Open Android Studio** with your project
2. **On the right side**, click **"Gradle"** tab
3. **Expand**: `android` → `Tasks` → `android`
4. **Double-click**: `signingReport`
5. **Look at the bottom panel** for output
6. **Find the SHA1 line** under "Variant: debug"
7. **Copy the SHA1 value** (looks like: `AA:BB:CC:DD:EE:FF:...`)

#### Method 2: Using Command Line

Open Command Prompt in your project folder:

```bash
cd android
gradlew.bat signingReport
```

Look for the SHA1 line in the output.

### Step 5: Add SHA-1 to Firebase

1. **Back in Firebase Console** → Your Android app
2. **Scroll down to "SHA certificate fingerprints"**
3. **Click "Add fingerprint"**
4. **Paste your SHA1 value**
5. **Click "Save"**

### Step 6: Enable Google Sign-In

1. **In Firebase Console**, go to **Authentication**
2. **Click "Sign-in method" tab**
3. **Find "Google"** in the providers list
4. **Click "Enable"**
5. **Enter your support email**
6. **Click "Save"**

### Step 7: Verify google-services.json Location

Make sure the file is in the correct location:

```
your-project/
├── android/
│   ├── app/
│   │   ├── google-services.json  ← HERE!
│   │   └── build.gradle
│   └── build.gradle
└── other files...
```

### Step 8: Rebuild Android App

1. **In Android Studio**:
   - Build → Clean Project
   - Build → Rebuild Project
   - Build → Build Bundle(s) / APK(s) → Build APK(s)

2. **Or sync Capacitor**:
   ```bash
   npx cap sync android
   npx cap open android
   ```

### Step 9: Test Google Sign-In

1. **Install the new APK** on your phone
2. **Open the app**
3. **Try Google Sign-In**
4. **Should work now!** ✅

## Troubleshooting Common Issues

### Error: "Developer Error" or "Error 12501"

**Cause**: Package name mismatch or SHA-1 missing
**Solution**:

- Verify package name is exactly `com.infinitynote.app`
- Make sure SHA-1 is added to Firebase
- Wait 5-10 minutes for changes to propagate

### Error: "Sign-in failed" or "Error 10"

**Cause**: SHA-1 fingerprint not added or incorrect
**Solution**:

- Get SHA-1 again: `cd android && gradlew.bat signingReport`
- Add to Firebase Console
- Rebuild app

### Error: "Network Error"

**Cause**: google-services.json not found or in wrong location
**Solution**:

- Verify file is in `android/app/google-services.json`
- Check file is not corrupted
- Rebuild project

### Google Sign-In popup doesn't appear

**Cause**: WebView restrictions
**Solution**: Update `capacitor.config.ts`:

```typescript
android: {
  allowMixedContent: true,
  webContentsDebuggingEnabled: true,
}
```

## Quick Checklist

- [ ] **Added Android app** in Firebase Console
- [ ] **Downloaded google-services.json**
- [ ] **Placed file in** `android/app/google-services.json`
- [ ] **Got SHA-1 fingerprint** from `gradlew signingReport`
- [ ] **Added SHA-1** to Firebase Console
- [ ] **Enabled Google Sign-In** in Firebase Authentication
- [ ] **Waited 5-10 minutes** for changes to propagate
- [ ] **Rebuilt Android app**
- [ ] **Installed new APK**
- [ ] **Tested Google Sign-In**

## Alternative: Use Capacitor Firebase Plugin

If the above doesn't work, you can use the native Firebase plugin:

```bash
npm install @capacitor-firebase/authentication
npx cap sync android
```

This requires code changes but provides better native integration.

## Files You Need

1. **google-services.json** - Download from Firebase Console
2. **SHA-1 fingerprint** - Get from `gradlew signingReport`

## Important Notes

- **Changes take 5-10 minutes** to propagate in Firebase
- **Package name must match exactly**: `com.infinitynote.app`
- **SHA-1 is required** for Google Sign-In to work
- **Different SHA-1 needed** for debug vs release builds

## Expected Result

After completing all steps:

- ✅ Google Sign-In button appears in Android app
- ✅ Clicking opens Google account picker
- ✅ User can select account and sign in
- ✅ App receives authentication token
- ✅ User is logged in successfully

## Need Help?

If you're still having issues:

1. **Check Firebase Console** for any error messages
2. **Verify all steps** were completed exactly
3. **Wait 10 minutes** and try again
4. **Check Android Logcat** in Android Studio for detailed errors

The most common issue is missing SHA-1 fingerprint - make sure you add it to Firebase!
