import { NextRequest } from 'next/server'
import { verifyIdToken } from './firebase-admin'

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No authorization header')
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await verifyIdToken(idToken)

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    throw new Error('Unauthorized')
  }
}

export async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false, email: null, uid: null }
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await verifyIdToken(idToken)

    return {
      authenticated: true,
      email: decodedToken.email || null,
      uid: decodedToken.uid,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { authenticated: false, email: null, uid: null }
  }
}
