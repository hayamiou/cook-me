import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DARK, LIGHT } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginScreen() {
  const scheme = useColorScheme()
  const C = scheme === 'dark' ? DARK : LIGHT
  const { signIn, isLoading } = useAuth()
  const router = useRouter()

  async function handleLogin() {
    try {
      await signIn()
      router.replace('/accueil')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <StatusBar barStyle={C.statusBar} backgroundColor={C.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topSection}>
            <View style={[styles.logoCircle, { backgroundColor: C.primaryLight }]}>
              <Text style={styles.logoEmoji}>🍳</Text>
            </View>
            <Text style={[styles.appName, { color: C.text }]}>Cook-Me</Text>
            <Text style={[styles.subtitle, { color: C.textMuted }]}>
              Connecte-toi pour accéder à tes recettes
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.cardTitle, { color: C.text }]}>Connexion</Text>
            <Text style={[styles.cardDesc, { color: C.textMuted }]}>
              Utilise ton compte SSO pour te connecter
            </Text>

            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={isLoading}
              style={[styles.primaryBtn, { backgroundColor: C.primary }]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.btnContent}>
                  <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.btnIcon} />
                  <Text style={styles.primaryBtnText}>Se connecter avec SSO</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  topSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoEmoji: { fontSize: 36 },
  appName: { fontSize: 28, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  cardTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 14, marginBottom: 24 },
  primaryBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#2e7d32',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  btnIcon: { marginRight: 8 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
})
