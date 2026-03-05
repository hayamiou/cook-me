import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthCallback() {
  const params = useLocalSearchParams()
  const { code } = params as { code?: string }
  const { handleCallback } = useAuth()
  const router = useRouter()
  const hasRun = useRef(false)

  console.log('[AuthCallback] params:', JSON.stringify(params))
  console.log('[AuthCallback] code:', code)

  useEffect(() => {
    if (!code) {
      console.warn('[AuthCallback] No code received, redirecting to login')
      router.replace('/login')
      return
    }

    if (hasRun.current) return
    hasRun.current = true

    handleCallback(code)
      .then(() => router.replace('/accueil'))
      .catch(() => router.replace('/login'))
  }, [code, handleCallback, router])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2e7d32" />
    </View>
  )
}
