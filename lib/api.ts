import { auth } from './firebase'

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  if (!auth) {
    throw new Error('Firebase auth not initialized')
  }

  const user = auth.currentUser

  if (!user) {
    throw new Error('User not authenticated')
  }

  const token = await user.getIdToken()

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
