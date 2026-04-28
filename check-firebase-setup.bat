@echo off
echo.
echo ========================================
echo Firebase Android Setup Diagnostic
echo ========================================
echo.

echo 1. Checking google-services.json...
if exist "android\app\google-services.json" (
    echo ✅ google-services.json found in android/app/
) else (
    echo ❌ google-services.json NOT found in android/app/
    echo    Download it from Firebase Console and place it there
)
echo.

echo 2. Checking package name in capacitor.config.ts...
findstr "com.infinitynote.app" capacitor.config.ts >nul
if %errorlevel%==0 (
    echo ✅ Package name: com.infinitynote.app
) else (
    echo ❌ Package name not found or incorrect
)
echo.

echo 3. Checking build.gradle configuration...
findstr "google-services" android\app\build.gradle >nul
if %errorlevel%==0 (
    echo ✅ Google Services plugin configured
) else (
    echo ❌ Google Services plugin not configured
)
echo.

echo 4. Next steps:
echo    - Get SHA-1: Run get-sha1-simple.bat
echo    - Add SHA-1 to Firebase Console
echo    - Enable Google Sign-In in Firebase Authentication
echo    - Rebuild Android app
echo.
echo ========================================
pause