import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { Platform, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DARK, LIGHT } from '@/constants/theme'

// Layout de la barre de navigation inférieure.
// Configure les trois onglets (Toutes les recettes, Favoris, Mes recettes)
// et leur apparence selon le thème système.
export default function TabLayout() {
  const scheme = useColorScheme()
  const C = scheme === 'dark' ? DARK : LIGHT
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.textMuted,
        tabBarStyle: {
          backgroundColor: C.surface,
          borderTopColor: C.border,
          borderTopWidth: 1,
          // Hauteur adaptative : ajoute le padding du bas de l'écran
          height: Platform.OS === 'ios' ? 88 : 60 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? 34 : insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {/* Tab 1 : Toutes les recettes (home) */}
      <Tabs.Screen
        name="accueil"
        options={{
          title: 'Toutes les recettes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Tab 2 : Favoris */}
      <Tabs.Screen
        name="favoris"
        options={{
          title: 'Favoris',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Tab 3 : Mes recettes */}
      <Tabs.Screen
        name="mes-recettes"
        options={{
          title: 'Mes recettes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
