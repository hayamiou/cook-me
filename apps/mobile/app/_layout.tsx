import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'
import '../global.css'

import { useColorScheme } from '@/components/useColorScheme'
import { CartProvider } from '@/context/CartContext'
import { RecipesProvider } from '@/context/RecipesContext'
import { AuthProvider } from '@/contexts/AuthContext'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

// Empêche le splash screen de se cacher avant le chargement des polices.
SplashScreen.preventAutoHideAsync()

// Layout racine : charge les polices, gère le splash screen et enveloppe l'app
// dans les providers globaux (CartProvider, RecipesProvider, ThemeProvider).
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

// Sous-composant interne : configure la navigation et les providers de thème.
// Séparé de RootLayout pour utiliser useColorScheme après le chargement des polices.
function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <AuthProvider>
      <CartProvider>
        <RecipesProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="panier" options={{ headerShown: false }} />
              <Stack.Screen name="profil" options={{ headerShown: false }} />
              <Stack.Screen name="create-recipe" options={{ headerShown: false }} />
              <Stack.Screen name="recette/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </ThemeProvider>
        </RecipesProvider>
      </CartProvider>
    </AuthProvider>
  )
}
