@echo off
echo.
echo 🚀 Building Infinity Note for Android...
echo.

REM Step 1: Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Step 2: Build Next.js app
echo 🔨 Building Next.js app...
call npm run build

REM Step 3: Sync Capacitor
echo 🔄 Syncing Capacitor...
call npx cap sync android

REM Step 4: Open Android Studio
echo 📱 Opening Android Studio...
echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. In Android Studio, click 'Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)'
echo 2. Wait for build to complete
echo 3. Find your APK in android/app/build/outputs/apk/debug/
echo.
echo For more details, see ANDROID_BUILD.md
echo.

call npx cap open android
