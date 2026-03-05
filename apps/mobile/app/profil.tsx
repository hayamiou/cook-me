import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DARK, LIGHT } from '@/constants/theme'

export default function ProfileScreen() {
  const router = useRouter()

  // Lit le thème système du téléphone
  const scheme = useColorScheme()
  const C = scheme === 'dark' ? DARK : LIGHT

  const handleLogout = () => {
    Alert.alert('Se déconnecter', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: async () => {
          router.replace('/login')
        },
      },
    ])
  }

  const menuItems = [
    { icon: 'settings-outline' as const, label: 'Paramètres', onPress: () => {} },
    { icon: 'log-out-outline' as const, label: 'Se déconnecter', onPress: handleLogout },
  ]

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

        <Text style={[styles.name, { color: C.text }]}>{'Utilisateur'}</Text>
        <Text style={[styles.email, { color: C.textMuted }]}>{'email@example.com'}</Text>

        {/* Menu */}
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuRow, { backgroundColor: C.surface, borderColor: C.border }]}
            activeOpacity={0.7}
            onPress={item.onPress}
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
