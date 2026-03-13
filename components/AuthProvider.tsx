'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { Capacitor } from '@capacitor/core'
import { useCapacitor } from '@/hooks/useCapacitor'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { isCapacitor, isAndroid } = useCapacitor()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    // Initialize Google Auth for Capacitor
    const initializeGoogleAuth = async () => {
      if (isCapacitor) {
        console.log('🔧 Initializing Google Auth for Capacitor...')
        try {
          await GoogleAuth.initialize({
            clientId: '146747879201-9monjaqbenjsiptn9tk0av7f8sgm903u.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
          })
          console.log('✅ Google Auth initialized successfully')
        } catch (error) {
          console.error('❌ Failed to initialize Google Auth:', error)
        }
      }
    }

    initializeGoogleAuth()

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [isCapacitor])

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error('Firebase auth not initialized')
    }

    console.log('🚀 Starting Google Sign-In...')
    console.log('📱 Is Capacitor:', isCapacitor)
    console.log('🤖 Is Android:', isAndroid)
    console.log('🌐 Platform:', Capacitor.getPlatform())

    try {
      if (isCapacitor) {
        console.log('📱 Using native Google Auth...')

        // Use native Google Auth for Capacitor
        const result = await GoogleAuth.signIn()
        console.log('✅ Native sign-in result:', result)

        if (result.authentication?.idToken) {
          console.log('🔑 Creating Firebase credential...')
          // Create Firebase credential from Google Auth result
          const credential = GoogleAuthProvider.credential(result.authentication.idToken)
          await signInWithCredential(auth, credential)
          console.log('✅ Firebase sign-in successful')
        } else {
          throw new Error('No ID token received from Google Auth')
        }
      } else {
        console.log('🌐 Using web popup...')
        // Use popup for web
        await signInWithPopup(auth, googleProvider)
      }
    } catch (error) {
      console.error('❌ Error signing in with Google:', error)
      throw error
    }
  }

  const logout = async () => {
    if (!auth) {
      throw new Error('Firebase auth not initialized')
    }

    try {
      // Sign out from native Google Auth if on mobile
      if (isCapacitor) {
        console.log('📱 Signing out from native Google Auth...')
        await GoogleAuth.signOut()
      }

      // Sign out from Firebase
      console.log('🔥 Signing out from Firebase...')
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
