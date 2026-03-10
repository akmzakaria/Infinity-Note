# Firebase Authentication Setup

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "infinity-note")
4. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Google" provider
5. Toggle "Enable"
6. Add your project's domain to authorized domains if needed
7. Save the configuration

## 3. Get Firebase Configuration

1. Go to Project Settings (gear icon in sidebar)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 4. Update Environment Variables

Replace the placeholder values in `.env.local` with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

## 5. Test the Setup

1. Restart your development server: `npm run dev`
2. Navigate to `/login` to test Google authentication
3. The authentication should work and redirect you to the main app

## Features Added

- ✅ Google Sign-in with Firebase Auth
- ✅ Protected routes (redirects to login if not authenticated)
- ✅ User profile display with photo and name
- ✅ Logout functionality
- ✅ Consistent dark theme across all auth pages
- ✅ Toast notifications for auth actions

## Usage

- Users must sign in with Google to access the app
- User info is displayed in the header and profile page
- All note pages are protected and require authentication
- Sign out is available from the header and profile page
