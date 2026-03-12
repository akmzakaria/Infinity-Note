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
}

export default config
