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
  revocationEndpoint: `${KEYCLOAK_ISSUER}/protocol/openid-connect/logout`,
}

// Pure-JS base64 alphabet – avoids atob/btoa globals which are not guaranteed in all RN versions
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function decodeBase64(base64: string): string {
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  let binary = ''
  for (let i = 0; i < padded.length; i += 4) {
    const a = BASE64_CHARS.indexOf(padded[i])
    const b = BASE64_CHARS.indexOf(padded[i + 1])
    const c = BASE64_CHARS.indexOf(padded[i + 2])
    const d = BASE64_CHARS.indexOf(padded[i + 3])
    binary += String.fromCharCode((a << 2) | (b >> 4))
    if (padded[i + 2] !== '=') binary += String.fromCharCode(((b & 15) << 4) | (c >> 2))
    if (padded[i + 3] !== '=') binary += String.fromCharCode(((c & 3) << 6) | d)
  }
  return binary
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      decodeBase64(base64)
        .split('')
        .map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(''),
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
          const now = Math.floor(Date.now() / 1000)

          if (!payload.sub || !payload.exp || payload.exp <= now) {
            // Token invalide ou expiré : le supprimer et rester non authentifié
            console.warn(
              'Stored token is invalid or expired, clearing session.',
              !payload.sub
                ? 'Missing sub.'
                : `Token expired at ${new Date(payload.exp * 1000).toISOString()}.`,
            )
            await SecureStore.deleteItemAsync('accessToken')
          } else {
            setAccessToken(storedToken)
            setIsAuthenticated(true)
            setUser({
              userId: payload.sub,
              email: payload.email,
              username: payload.preferred_username,
            })
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
    if (typeof str === 'string') {
      // Already base64 – just convert to URL-safe base64 and strip padding
      return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    }
    // Pure-JS Uint8Array → base64url encoder
    let base64 = ''
    for (let i = 0; i < str.length; i += 3) {
      const b0 = str[i]
      const b1 = i + 1 < str.length ? str[i + 1] : 0
      const b2 = i + 2 < str.length ? str[i + 2] : 0
      base64 += BASE64_CHARS[b0 >> 2]
      base64 += BASE64_CHARS[((b0 & 3) << 4) | (b1 >> 4)]
      base64 += i + 1 < str.length ? BASE64_CHARS[((b1 & 15) << 2) | (b2 >> 6)] : '='
      base64 += i + 2 < str.length ? BASE64_CHARS[b2 & 63] : '='
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
