import * as AuthSession from 'expo-auth-session'
import * as Crypto from 'expo-crypto'
import * as SecureStore from 'expo-secure-store'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

interface AuthContextData {
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
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

// Pour Expo Go / développement, utilisez le scheme défini dans app.json
const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'mobile',
  path: 'auth/callback',
})

const discovery = {
  authorizationEndpoint: `${KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
  tokenEndpoint: `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
  endSessionEndpoint: `${KEYCLOAK_ISSUER}/protocol/openid-connect/logout`,
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return {}
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    // Pad to a multiple of 4 for standard base64 (adds 0–3 '=' chars)
    const padded = `${base64}===`.slice(0, base64.length + (4 - (base64.length % 4)) % 4)
    // Pure JS base64 decode — avoids relying on atob (not always available in React Native)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    let bytes = ''
    for (let i = 0; i < padded.length; i += 4) {
      const b = (chars.indexOf(padded[i]) << 18) | (chars.indexOf(padded[i + 1]) << 12) |
        (chars.indexOf(padded[i + 2]) << 6) | chars.indexOf(padded[i + 3])
      bytes += String.fromCharCode((b >> 16) & 0xff, (b >> 8) & 0xff, b & 0xff)
    }
    // Remove padding null bytes and decode as UTF-8
    const jsonPayload = decodeURIComponent(
      bytes.split('').map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''),
    )
    return JSON.parse(jsonPayload)
  } catch (_e) {
    return {}
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  // Vérifier si un token existe au démarrage
  useEffect(() => {
    async function loadStoredToken() {
      try {
        const storedToken = await SecureStore.getItemAsync('accessToken')
        if (storedToken) {
          const payload = parseJwt(storedToken)
          const nowSec = Math.floor(Date.now() / 1000)
          if (payload.sub && typeof payload.exp === 'number' && payload.exp > nowSec) {
            setAccessToken(storedToken)
            setIsAuthenticated(true)
            setUser({
              userId: payload.sub,
              email: payload.email,
              username: payload.preferred_username,
            })
          } else {
            // Token missing required claims or expired — clear it
            await SecureStore.deleteItemAsync('accessToken')
          }
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

      // Générer code_verifier et code_challenge pour PKCE
      const codeVerifier = await generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(codeVerifier)

      // Lancer l'auth flow
      const authRequestOptions: AuthSession.AuthRequestConfig = {
        clientId: CLIENT_ID,
        redirectUri,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
        codeChallenge,
        codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      }

      const authRequest = new AuthSession.AuthRequest(authRequestOptions)
      const result = await authRequest.promptAsync(discovery)

      if (result.type === 'success') {
        const { code } = result.params

        // Échanger le code contre un token
        const tokenResponse = await exchangeCodeForToken(code, codeVerifier)

        if (tokenResponse.access_token) {
          await SecureStore.setItemAsync('accessToken', tokenResponse.access_token)
          setAccessToken(tokenResponse.access_token)
          setIsAuthenticated(true)

          const payload = parseJwt(tokenResponse.access_token)
          setUser({
            userId: payload.sub,
            email: payload.email,
            username: payload.preferred_username,
          })
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function signOut() {
    try {
      await SecureStore.deleteItemAsync('accessToken')
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
      throw new Error('Token exchange failed')
    }

    return response.json()
  }

  async function generateCodeVerifier(): Promise<string> {
    const randomBytes = Crypto.getRandomBytes(32)
    return base64URLEncode(randomBytes)
  }

  async function generateCodeChallenge(verifier: string): Promise<string> {
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier, {
      encoding: Crypto.CryptoEncoding.BASE64,
    })
    return base64URLEncode(hash)
  }

  function base64URLEncode(str: string | Uint8Array): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    let base64: string
    if (typeof str === 'string') {
      base64 = str
    } else {
      // Convert Uint8Array to base64 without relying on btoa
      const bytes = Array.from(str)
      let result = ''
      for (let i = 0; i < bytes.length; i += 3) {
        const b0 = bytes[i]
        const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0
        const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0
        result += chars[b0 >> 2]
        result += chars[((b0 & 3) << 4) | (b1 >> 4)]
        result += i + 1 < bytes.length ? chars[((b1 & 15) << 2) | (b2 >> 6)] : '='
        result += i + 2 < bytes.length ? chars[b2 & 63] : '='
      }
      base64 = result
    }
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        accessToken,
        signIn,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
