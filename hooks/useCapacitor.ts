import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

export function useCapacitor() {
  const [isCapacitor, setIsCapacitor] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if running in Capacitor (mobile app)
    const capacitorNative = Capacitor.isNativePlatform()
    setIsCapacitor(capacitorNative)

    // Check specific platforms
    const platform = Capacitor.getPlatform()
    setIsAndroid(platform === 'android')
    setIsIOS(platform === 'ios')
  }, [])

  return {
    isCapacitor,
    isAndroid,
    isIOS,
    isWeb: !isCapacitor,
  }
}
