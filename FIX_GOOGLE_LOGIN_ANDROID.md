# Fix Google Login in Android App

## Why Google Login Doesn't Work

Firebase Authentication needs to be configured specifically for Android. Your web app works fine, but the Android app needs additional setup in Firebase Console.

## Solution: Add Android App to Firebase

### Step 1: Go to Firebase Console

1. Open https://console.firebase.google.com
2. Select your project (akm-skillverse or your project name)
3. Click the gear icon ⚙️ next to "Project Overview"
4. Click "Project settings"

### Step 2: Add Android App

1. Scroll down to "Your apps" section
2. Click the **Android icon** (robot icon) to add Android app
3. Fill in the form:

**Android package name:** `com.infinitynote.app`
(This MUST match the appId in your capacitor.config.ts)

**App nickname (optional):** `Infinity Note Android`

**Debug signing certificate SHA-1 (optional for now):** Leave blank for testing

4. Click **"Register app"**

### Step 3: Download google-services.json

1. Firebase will generate a `google-services.json` file
2. Click **"Download google-services.json"**
3. Save this file

### Step 4: Add google-services.json to Your Project

**Important:** Place the file in the correct location:

```
android/app/google-services.json
```

Copy the downloaded file to: `android/app/google-services.json`

### Step 5: Update Android Build Configuration

The `google-services.json` file should be automatically detected, but let's verify:

1. Open `android/app/build.gradle` in a text editor
2. Make sure these lines exist at the bottom:

```gradle
apply plugin: 'com.google.gms.google-services'
```

3. Open `android/build.gradle` and verify this line exists in dependencies:

```gradle
classpath 'com.google.gms:google-services:4.3.15'
```

### Step 6: Add SHA-1 Certificate (Required for Google Sign-In)

Google Sign-In requires SHA-1 fingerprint for security.

#### Get SHA-1 for Debug Build:

**On Windows:**

```bash
cd android
gradlew signingReport
```

**On Mac/Linux:**

```bash
cd android
./gradlew signingReport
```

Look for output like:

```
Variant: debug
Config: debug
Store: C:\Users\YourName\.android\debug.keystore
Alias: AndroidDebugKey
MD5: XX:XX:XX...
SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
SHA-256: ...
```

Copy the **SHA1** value (the long string with colons)

#### Add SHA-1 to Firebase:

1. Go back to Firebase Console
2. Click your Android app
3. Scroll down to "SHA certificate fingerprints"
4. Click **"Add fingerprint"**
5. Paste your SHA-1 value
6. Click **"Save"**

### Step 7: Enable Google Sign-In in Firebase

1. In Firebase Console, go to **Authentication**
2. Click **"Sign-in method"** tab
3. Find **Google** in the list
4. Click **"Enable"**
5. Enter your support email
6. Click **"Save"**

### Step 8: Add Authorized Domains

1. Still in Authentication → Sign-in method
2. Scroll down to **"Authorized domains"**
3. Make sure these are added:
   - `localhost` (for testing)
   - Your Vercel domain (e.g., `infinity-note.vercel.app`)
   - `firebaseapp.com` (should be there by default)

### Step 9: Rebuild Your Android App

1. In Android Studio, click **Build → Clean Project**
2. Wait for it to finish
3. Click **Build → Rebuild Project**
4. Or build new APK: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

### Step 10: Install and Test

1. Install the new APK on your phone
2. Open the app
3. Try Google Sign-In
4. It should now work! 🎉

## Alternative: Use Capacitor Firebase Authentication Plugin

If the above doesn't work, you can use the native Firebase plugin:

### Install Plugin:

```bash
npm install @capacitor-firebase/authentication
npx cap sync android
```

### Update Your Code:

This requires code changes to use native authentication instead of web-based.

## Troubleshooting

### "Sign-in failed" or "Error 10"

**Cause:** SHA-1 fingerprint not added or incorrect

**Solution:**

1. Get SHA-1 again: `cd android && gradlew signingReport`
2. Add to Firebase Console
3. Wait 5 minutes for changes to propagate
4. Rebuild app

### "Developer Error" or "Error 12501"

**Cause:** Package name mismatch

**Solution:**

1. Verify package name in Firebase matches `com.infinitynote.app`
2. Check `android/app/build.gradle` has correct `applicationId`
3. Rebuild app

### "Network Error"

**Cause:** google-services.json not found

**Solution:**

1. Verify `google-services.json` is in `android/app/` folder
2. Rebuild project in Android Studio
3. Check file is not in .gitignore

### Google Sign-In popup doesn't appear

**Cause:** WebView restrictions

**Solution:**

1. Update `capacitor.config.ts`:

```typescript
android: {
  allowMixedContent: true,
  webContentsDebuggingEnabled: true,
}
```

2. Rebuild and test

### Still not working?

Try using "Continue Offline" button to test other features while we debug Google login.

## For Production (Release Build)

When building release APK, you need to:

1. Generate release keystore
2. Get SHA-1 from release keystore
3. Add release SHA-1 to Firebase
4. Build signed release APK

## Quick Checklist

- [ ] Added Android app in Firebase Console
- [ ] Downloaded google-services.json
- [ ] Placed google-services.json in android/app/
- [ ] Got SHA-1 fingerprint from gradlew signingReport
- [ ] Added SHA-1 to Firebase Console
- [ ] Enabled Google Sign-In in Firebase Authentication
- [ ] Rebuilt Android app
- [ ] Installed new APK
- [ ] Tested Google Sign-In

## Files You Need

1. **google-services.json** - Download from Firebase Console
2. **SHA-1 fingerprint** - Get from `gradlew signingReport`

## Important Notes

- Changes in Firebase Console can take 5-10 minutes to propagate
- You need different SHA-1 for debug and release builds
- The package name `com.infinitynote.app` must match everywhere
- google-services.json should NOT be committed to git (add to .gitignore)

## Next Steps

1. Follow steps 1-10 above
2. Rebuild your app
3. Test Google Sign-In
4. If still not working, check troubleshooting section

The most common issue is missing SHA-1 fingerprint. Make sure you add it to Firebase!
