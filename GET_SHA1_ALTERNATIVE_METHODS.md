# 🔑 Get SHA-1 Fingerprint - Alternative Methods

## Method 1: Using Android Studio Terminal (Easiest)

1. **In Android Studio**, go to **View → Tool Windows → Terminal**
2. **In the terminal at the bottom**, type:
   ```
   cd android
   gradlew signingReport
   ```
3. **Press Enter** and wait for output
4. **Look for the SHA1 line** like:
   ```
   SHA1: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
   ```
5. **Copy the SHA1 value**

## Method 2: Using Windows Command Prompt

1. **Open Command Prompt** (not PowerShell)
2. **Navigate to your project**:
   ```
   cd "E:\VS Code\Workspace4 (NEXT.JS)\Projects\Infinity Note"
   ```
3. **Go to android folder**:
   ```
   cd android
   ```
4. **Run the signing report**:
   ```
   gradlew.bat signingReport
   ```
5. **Look for the SHA1 line** in the output

## Method 3: Using Android Studio Build Menu

1. **In Android Studio**, go to **Build → Generate Signed Bundle / APK**
2. **Select APK** and click **Next**
3. **Click "Create new..."** to create a keystore
4. **During this process**, Android Studio will show you certificate details including SHA-1
5. **Copy the SHA-1** (you don't need to complete the signing process)

## Method 4: Using Gradle Panel (Alternative Path)

If you can't find `android → Tasks → android`, try:

1. **Right-click on "android" in Gradle panel**
2. **Look for "Tasks"** or **"All tasks"**
3. **Expand and look for**:
   - `android` folder
   - `help` folder
   - `verification` folder
4. **Find "signingReport"** in any of these folders
5. **Double-click it**

## Method 5: Using Default Debug Keystore

The SHA-1 is generated from your debug keystore. You can find it at:

**Windows:**

```
C:\Users\[YourUsername]\.android\debug.keystore
```

**Use KeyTool (if Java is in PATH):**

```
keytool -list -v -keystore C:\Users\[YourUsername]\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

## Method 6: Using Online Tools

1. **Build your APK** first
2. **Upload APK** to online SHA-1 extractor tools
3. **Get the SHA-1** from the tool
4. **Add to Firebase**

## Method 7: Check Android Studio Gradle Sync

1. **Make sure Gradle sync is complete** (bottom right corner)
2. **If not synced**, click **"Sync Now"** or go to **File → Sync Project with Gradle Files**
3. **Wait for sync to complete**
4. **Try the Gradle panel again**

## What the SHA-1 Looks Like

The SHA-1 fingerprint is a 40-character string that looks like:

```
SHA1: A1:B2:C3:D4:E5:F6:07:18:29:3A:4B:5C:6D:7E:8F:90:A1:B2:C3:D4
```

**Copy everything after "SHA1: "** (including the colons)

## Quick Test: Check if Java is Available

Open Command Prompt and type:

```
java -version
```

If Java is available, you can use Method 5 (KeyTool).

## Troubleshooting

### "gradlew is not recognized"

- Make sure you're in the `android` folder
- Use `gradlew.bat` instead of `gradlew` on Windows

### "JAVA_HOME not set"

- Use Android Studio Terminal instead (Method 1)
- Android Studio has its own Java environment

### "Task 'signingReport' not found"

- Make sure Gradle sync is complete
- Try refreshing the Gradle panel
- Use Android Studio Terminal (Method 1)

## Recommended Order

Try these methods in order:

1. **Method 1** (Android Studio Terminal) - Usually works
2. **Method 2** (Command Prompt) - If Java is available
3. **Method 3** (Build Menu) - Visual method
4. **Method 4** (Alternative Gradle path) - If panel structure is different

## After Getting SHA-1

1. **Copy the SHA-1 value**
2. **Go to Firebase Console**: https://console.firebase.google.com
3. **Project Settings → Your Android App**
4. **SHA certificate fingerprints → Add fingerprint**
5. **Paste SHA-1 and Save**
6. **Wait 5-10 minutes**
7. **Rebuild Android app**
8. **Test Google Sign-In**

## Need More Help?

If none of these methods work:

1. **Take a screenshot** of your Android Studio Gradle panel
2. **Check if Gradle sync completed successfully**
3. **Try building the APK first** - sometimes this generates the necessary files
4. **Use Method 3** (Build menu) as it's most reliable

The SHA-1 is essential for Firebase Google Sign-In to work in Android apps!
