import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Only initialize Firebase if we have the required config
// This prevents errors during Vercel build time when env vars might be missing
const app = typeof window !== 'undefined' || process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  ? initializeApp(firebaseConfig)
  : null

export const auth = app ? getAuth(app) : null
export const googleProvider = typeof window !== 'undefined' || process.env.NEXT_PUBLIC_FIREBASE_API_KEY 
  ? new GoogleAuthProvider() 
  : null
