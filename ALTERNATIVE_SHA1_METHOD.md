# Alternative: Skip SHA-1 for Now (Quick Fix)

## The Good News

You can actually **test Google Sign-In without SHA-1** first! Here's how:

## Quick Steps (Skip SHA-1 for now)

### Step 1: Add Android App to Firebase

1. Go to https://console.firebase.google.com
2. Select your project
3. Click ⚙️ → Project settings
4. Click the Android icon (🤖)
5. Enter: `com.infinitynote.app`
6. **Skip the SHA-1 field** (leave it blank)
7. Click "Register app"

### Step 2: Download google-services.json

1. Download the `google-services.json` file
2. Place it in: `android/app/google-services.json`

### Step 3: Enable Google Sign-In

1. In Firebase Console → Authentication
2. Sign-in method tab
3. Enable Google
4. Save

### Step 4: Rebuild and Test

1. Clean and rebuild your Android app
2. Install new APK
3. Try Google Sign-In

## What Happens Without SHA-1?

- **Development/Debug builds**: Often work without SHA-1
- **Some devices**: May work fine
- **Others**: May show "Developer Error" or fail

## If It Works - Great!

If Google Sign-In works without SHA-1, you're done!

## If It Doesn't Work

Then we'll get the SHA-1. But let's try this first since it's faster.

## How to Get SHA-1 Later (Easiest Method)

### Method 1: Use Android Studio Built-in Tool

1. In Android Studio, go to **Build → Generate Signed Bundle / APK**
2. Select **APK**
3. Click **Next**
4. Click **Create new...** (to create keystore)
5. During this process, Android Studio will show you the SHA-1!

### Method 2: Use Online Tool

1. Build your APK
2. Upload it to an online SHA-1 extractor tool
3. Get the SHA-1 from there

### Method 3: Use Windows PowerShell (If Java is installed)

Open PowerShell as Administrator and try:

```powershell
cd "android"
.\gradlew.bat signingReport
```

## Default Debug Keystore Location

The debug keystore is usually at:

```
C:\Users\[YourUsername]\.android\debug.keystore
```

You can use tools like KeyStore Explorer to open it and get the SHA-1.

## Summary

1. **Try without SHA-1 first** (might work!)
2. **If it fails**, then we'll get the SHA-1
3. **Multiple methods available** to get SHA-1

Let's start with the no-SHA-1 approach and see if it works!
