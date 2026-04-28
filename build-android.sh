#!/bin/bash

# Infinity Note - Android Build Script

echo "🚀 Building Infinity Note for Android..."
echo ""

# Check if Android Studio is installed
if ! command -v android &> /dev/null; then
    echo "⚠️  Warning: Android Studio may not be installed"
    echo "   Download from: https://developer.android.com/studio"
    echo ""
fi

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Build Next.js app
echo "🔨 Building Next.js app..."
npm run build

# Step 3: Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

# Step 4: Open Android Studio
echo "📱 Opening Android Studio..."
echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. In Android Studio, click 'Build > Build Bundle(s) / APK(s) > Build APK(s)'"
echo "2. Wait for build to complete"
echo "3. Find your APK in android/app/build/outputs/apk/debug/"
echo ""
echo
echo ""

npx cap open android
