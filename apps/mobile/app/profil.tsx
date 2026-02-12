import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// ─── Palettes clair / sombre ─────────────────────────────────────────────────
const LIGHT = {
  primary: '#F4A623',
  primaryLight: '#FDEABF',
  background: '#FAFAF7',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#8A8A8A',
  border: '#EFEFEF',
  statusBar: 'dark-content' as const,
}

const DARK = {
  primary: '#F4A623',
  primaryLight: '#3D2E10',
  background: '#111111',
  surface: '#1E1E1E',
  text: '#F0F0F0',
  textMuted: '#888888',
  border: '#2C2C2C',
  statusBar: 'light-content' as const,
}

const MENU_ITEMS = [
  { icon: 'settings-outline', label: 'Paramètres' },
  { icon: 'log-out-outline', label: 'Se déconnecter' },
] as const

export default function ProfileScreen() {
  const router = useRouter()

  // Lit le thème système du téléphone
  const scheme = useColorScheme()
  const C = scheme === 'dark' ? DARK : LIGHT

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <StatusBar barStyle={C.statusBar} backgroundColor={C.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.background }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>Mon profil</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Corps */}
      <View style={styles.body}>
        {/* Avatar */}
        <View style={[styles.avatarCircle, { backgroundColor: C.primaryLight }]}>
          <Ionicons name="person" size={52} color={C.primary} />
        </View>

        <Text style={[styles.name, { color: C.text }]}>Utilisateur</Text>
        <Text style={[styles.email, { color: C.textMuted }]}>utilisateur@email.com</Text>

        {/* Menu */}
        {MENU_ITEMS.map(item => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuRow, { backgroundColor: C.surface, borderColor: C.border }]}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={22} color={C.primary} />
            <Text style={[styles.menuLabel, { color: C.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={C.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

// ─── Styles statiques ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 10,
  },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  body: { alignItems: 'center', paddingTop: 32, paddingHorizontal: 24 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  email: { fontSize: 14, marginBottom: 32 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    marginBottom: 10,
    gap: 14,
    borderWidth: 1,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
})
