# Get SHA-1 Using Android Studio (Easy Method)

## Step-by-Step Instructions

### Step 1: Open Android Studio

- Open Android Studio
- Make sure your project is loaded (you should see the `android` folder structure)

### Step 2: Find the Gradle Panel

- Look on the **right side** of Android Studio
- You should see a tab called **"Gradle"**
- If you don't see it, go to **View → Tool Windows → Gradle**

### Step 3: Navigate to Signing Report

1. Click the **"Gradle"** tab on the right
2. You'll see a tree structure
3. Expand **"android"** (your project name)
4. Expand **"Tasks"**
5. Expand **"android"**
6. Look for **"signingReport"**

### Step 4: Run Signing Report

1. **Double-click** on **"signingReport"**
2. Wait for it to run (takes 10-30 seconds)
3. Look at the **bottom panel** of Android Studio

### Step 5: Find Your SHA-1

In the output, look for something like this:

```
Variant: debug
Config: debug
Store: C:\Users\YourName\.android\debug.keystore
Alias: AndroidDebugKey
MD5: XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX
SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
SHA-256: ...
```

**Copy the SHA1 line!** It's the long string with colons like:
`AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD`

## Alternative Method: Using Terminal in Android Studio

If the Gradle panel method doesn't work:

1. In Android Studio, go to **View → Tool Windows → Terminal**
2. In the terminal at the bottom, type:
   ```
   gradlew signingReport
   ```
3. Press Enter and wait
4. Look for the SHA1 line in the output

## Alternative Method: Using Windows Command Prompt

1. Open **Command Prompt** (not PowerShell)
2. Navigate to your project:
   ```
   cd "E:\VS Code\Workspace4 (NEXT.JS)\Projects\Infinity Note\android"
   ```
3. Run:
   ```
   gradlew.bat signingReport
   ```
4. Look for the SHA1 line

## What the SHA-1 Looks Like

The SHA-1 fingerprint is a 40-character string that looks like:

```
SHA1: A1:B2:C3:D4:E5:F6:07:18:29:3A:4B:5C:6D:7E:8F:90:A1:B2:C3:D4
```

**Copy everything after "SHA1: "** (including the colons)

## Troubleshooting

### "Task 'signingReport' not found"

- Make sure you're in the correct project
- Try refreshing Gradle: **File → Sync Project with Gradle Files**

### "JAVA_HOME not set"

- Android Studio should handle this automatically
- Try using the Terminal method inside Android Studio instead

### Can't find Gradle panel

- Go to **View → Tool Windows → Gradle**
- Or try **View → Appearance → Tool Window Bars**

## What to Do with SHA-1

Once you have the SHA-1:

1. Go to Firebase Console
2. Select your project
3. Go to Project Settings
4. Find your Android app
5. Scroll to "SHA certificate fingerprints"
6. Click "Add fingerprint"
7. Paste your SHA-1
8. Click "Save"

## Quick Visual Guide

```
Android Studio
├── Right side panel
│   └── Gradle tab
│       └── android (your project)
│           └── Tasks
│               └── android
│                   └── signingReport ← Double-click this!
└── Bottom panel (output appears here)
    └── Look for "SHA1: AA:BB:CC..." ← Copy this!
```

## Still Having Issues?

If none of these methods work, you can:

1. **Skip SHA-1 for now** - Try adding the Android app to Firebase without SHA-1 first
2. **Use a different method** - Some online tools can generate SHA-1 from APK files
3. **Contact me** - I can help troubleshoot further

The most important thing is getting the `google-services.json` file in the right place first!
