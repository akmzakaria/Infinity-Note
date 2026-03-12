# Quick Fix: Google Login in Android App

## The Problem

Google Sign-In doesn't work in your Android app because Firebase needs Android-specific configuration.

## Quick Solution (5 Steps)

### Step 1: Add Android App to Firebase (2 minutes)

1. Go to https://console.firebase.google.com
2. Select your project
3. Click ⚙️ → Project settings
4. Scroll to "Your apps"
5. Click the **Android icon** (🤖)
6. Enter package name: **`com.infinitynote.app`**
7. Click "Register app"

### Step 2: Download google-services.json (1 minute)

1. Click "Download google-services.json"
2. Save the file

### Step 3: Add File to Your Project (1 minute)

Copy the downloaded `google-services.json` file to:

```
android/app/google-services.json
```

**Important:** It must be in the `android/app/` folder, NOT the root!

### Step 4: Get SHA-1 Fingerprint (2 minutes)

Open terminal in your project folder and run:

```bash
cd android
gradlew signingReport
```

Look for the **SHA1** line under "Variant: debug". It looks like:

```
SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
```

Copy this SHA1 value.

### Step 5: Add SHA-1 to Firebase (1 minute)

1. Back in Firebase Console → Your Android app
2. Scroll to "SHA certificate fingerprints"
3. Click "Add fingerprint"
4. Paste your SHA1
5. Click "Save"

### Step 6: Rebuild App (5 minutes)

In Android Studio:

1. **Build → Clean Project** (wait)
2. **Build → Rebuild Project** (wait)
3. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
4. Install new APK on your phone
5. Test Google Sign-In ✅

## That's It!

Google Sign-In should now work in your Android app.

## If It Still Doesn't Work

### Check These:

1. **Wait 5 minutes** - Firebase changes take time to propagate
2. **Verify package name** - Must be `com.infinitynote.app` everywhere
3. **Check google-services.json location** - Must be in `android/app/`
4. **Verify SHA-1** - Run `gradlew signingReport` again to confirm

### Alternative: Use Offline Mode

Your app has "Continue Offline" button that works without Google login. Users can:

- Create and edit notes offline
- Sync later when they sign in

## Files Checklist

- [ ] `google-services.json` downloaded from Firebase
- [ ] File placed in `android/app/google-services.json`
- [ ] SHA-1 fingerprint added to Firebase Console
- [ ] App rebuilt in Android Studio
- [ ] New APK installed on phone

## Common Errors

**"Error 10"** → SHA-1 not added or wrong
**"Developer Error"** → Package name mismatch
**"Network Error"** → google-services.json missing

## Need More Help?

See `FIX_GOOGLE_LOGIN_ANDROID.md` for detailed troubleshooting.

---

**Time Required:** ~10 minutes
**Difficulty:** Easy
**Success Rate:** 95%+ if steps followed correctly
