import * as AuthSession from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { Platform } from 'react-native'

// SecureStore ne fonctionne pas sur web → fallback localStorage
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return localStorage.getItem(key)
    return SecureStore.getItemAsync(key)
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value)
      return
    }
    await SecureStore.setItemAsync(key, value)
  },
  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key)
      return
    }
    await SecureStore.deleteItemAsync(key)
  },
}

interface AuthContextData {
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  handleCallback: (code: string) => Promise<void>
  user: User | null
}

interface User {
  userId: string
  email?: string
  username?: string
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

const KEYCLOAK_ISSUER =
  process.env.EXPO_PUBLIC_KEYCLOAK_ISSUER || 'http://localhost:8080/realms/cook-me'
const CLIENT_ID = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID || 'cook-me-mobile'

// Sur web, on utilise l'origine courante. Sur natif, le scheme de l'app.
const redirectUri =
  Platform.OS === 'web'
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://expo.cook-me.club'}/auth/callback`
    : AuthSession.makeRedirectUri({ scheme: 'mobile', path: 'auth/callback' })
console.log('[AuthContext] redirectUri:', redirectUri)

const discovery = {
  authorizationEndpoint: `${KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
  tokenEndpoint: `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
  revocationEndpoint: `${KEYCLOAK_ISSUER}/protocol/openid-connect/logout`,
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch (_e) {
    return {}
  }
}

function storeToken(token: string) {
  const payload = parseJwt(token)
  return { userId: payload.sub, email: payload.email, username: payload.preferred_username }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function loadStoredToken() {
      try {
        const storedToken = await storage.getItem('accessToken')
        if (storedToken) {
          setAccessToken(storedToken)
          setIsAuthenticated(true)
          setUser(storeToken(storedToken))
        }
      } catch (error) {
        console.error('Error loading token:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStoredToken()
  }, [])

  async function signIn() {
    try {
      setIsLoading(true)

      const authRequest = new AuthSession.AuthRequest({
        clientId: CLIENT_ID,
        redirectUri,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
      })

      // makeAuthUrlAsync génère le PKCE interne avant le redirect
      await authRequest.makeAuthUrlAsync(discovery)

      // Persiste le verifier interne pour la page callback (web)
      if (Platform.OS === 'web' && authRequest.codeVerifier) {
        sessionStorage.setItem('pkce_code_verifier', authRequest.codeVerifier)
      }

      const result = await authRequest.promptAsync(discovery)

      // Sur natif, le résultat est disponible ici
      if (result.type === 'success') {
        const { code } = result.params
        const tokenResponse = await exchangeCodeForToken(code, authRequest.codeVerifier ?? '')
        await applyToken(tokenResponse)
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCallback(code: string) {
    try {
      setIsLoading(true)
      const codeVerifier = sessionStorage.getItem('pkce_code_verifier') ?? ''
      sessionStorage.removeItem('pkce_code_verifier')
      console.log('[handleCallback] code:', code, 'verifier length:', codeVerifier.length)

      const tokenResponse = await exchangeCodeForToken(code, codeVerifier)
      await applyToken(tokenResponse)
    } catch (error) {
      console.error('Callback error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function applyToken(tokenResponse: { access_token?: string }) {
    if (tokenResponse.access_token) {
      await storage.setItem('accessToken', tokenResponse.access_token)
      setAccessToken(tokenResponse.access_token)
      setIsAuthenticated(true)
      setUser(storeToken(tokenResponse.access_token))
    }
  }

  async function signOut() {
    try {
      await storage.deleteItem('accessToken')
      setAccessToken(null)
      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  async function exchangeCodeForToken(code: string, codeVerifier: string) {
    const response = await fetch(discovery.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }).toString(),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Token exchange failed:', response.status, errorBody)
      throw new Error(`Token exchange failed: ${response.status}`)
    }

    return response.json()
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        accessToken,
        signIn,
        signOut,
        handleCallback,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
