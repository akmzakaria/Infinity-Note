@echo off
echo.
echo ========================================
echo Getting SHA-1 fingerprint for Android
echo ========================================
echo.
cd android
echo Running gradlew signingReport...
echo.
call gradlew.bat signingReport | findstr "SHA1:"
echo.
echo ========================================
echo Copy the SHA1 value above and add it to Firebase Console
echo Go to: Firebase Console > Project Settings > Your Android App > SHA certificate fingerprints
echo Click "Add fingerprint" and paste the SHA1 value
echo ========================================
echo.
pause