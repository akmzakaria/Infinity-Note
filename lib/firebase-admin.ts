import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Check if we have the required environment variables
const hasRequiredEnvVars =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY

if (!hasRequiredEnvVars && process.env.NODE_ENV === 'production') {
  console.warn('Firebase Admin SDK environment variables are missing')
}

const firebaseAdminConfig = hasRequiredEnvVars
  ? {
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      }),
    }
  : null

// Initialize Firebase Admin SDK only if config is available
let app: any = null
let adminAuth: any = null

if (firebaseAdminConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0]
    adminAuth = getAuth(app)
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error)
  }
}

export { adminAuth }

export async function verifyIdToken(idToken: string) {
  if (!adminAuth) {
    throw new Error('Firebase Admin SDK not initialized')
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    console.error('Error verifying ID token:', error)
    throw new Error('Invalid token')
  }
}
