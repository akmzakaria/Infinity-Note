import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.infinitynote.app',
  appName: 'Infinity Note',
  webDir: 'out',
  server: {
    // Point to your deployed Vercel URL
    url: 'https://infinity-note.vercel.app',
    cleartext: false,
    // For local development, uncomment these:
    // url: 'http://localhost:3000',
    // cleartext: true
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '146747879201-9monjaqbenjsiptn9tk0av7f8sgm903u.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
}

export default config
