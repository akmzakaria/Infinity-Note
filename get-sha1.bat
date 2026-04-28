@echo off
echo.
echo Getting SHA-1 fingerprint for Android app...
echo.
cd android
call gradlew signingReport
echo.
echo.
echo Look for the SHA1 line above (under "Variant: debug")
echo Copy the SHA1 value and add it to Firebase Console
echo.
pause
