import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// ─── Palettes ────────────────────────────────────────────────────────────────
const LIGHT = {
  primary: '#F4A623',
  primaryLight: '#FDEABF',
  background: '#FAFAF7',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#8A8A8A',
  border: '#E2E2E2',
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

export default function LoginScreen() {
  const router = useRouter()
  const scheme = useColorScheme()
  const C = scheme === 'dark' ? DARK : LIGHT

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

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
          {/* ── Logo / titre ── */}
          <View style={styles.topSection}>
            <Text style={[styles.appName, { color: C.text }]}>Cook-Me</Text>
            <Text style={[styles.subtitle, { color: C.textMuted }]}>
              Connecte-toi pour accéder à tes recettes
            </Text>
          </View>

          {/* ── Carte formulaire ── */}
          <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.cardTitle, { color: C.text }]}>Inscription</Text>
            <Text style={[styles.cardDesc, { color: C.textMuted }]}>Saisis tes informations</Text>

            {/* Email */}
            <Text style={[styles.label, { color: C.text }]}>Email</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: C.background, borderColor: C.border },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={C.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="m@example.com"
                placeholderTextColor={C.textMuted}
                style={[styles.input, { color: C.text }]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <Text style={[styles.label, { color: C.text }]}>Mot de passe</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: C.background, borderColor: C.border },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={C.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={C.textMuted}
                style={[styles.input, { color: C.text }]}
                secureTextEntry={!showPwd}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPwd(p => !p)} activeOpacity={0.7}>
                <Ionicons
                  name={showPwd ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={C.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Bouton Login */}
            <TouchableOpacity
              onPress={() => router.push('/accueil')}
              activeOpacity={0.85}
              style={[
                styles.primaryBtn,
                { backgroundColor: email && password ? C.primary : C.primaryLight },
              ]}
            >
              <Text style={styles.primaryBtnText}>Se connecter</Text>
            </TouchableOpacity>

            {/* Séparateur */}
            <View style={styles.separatorRow}>
              <View style={[styles.separatorLine, { backgroundColor: C.border }]} />
              <Text style={[styles.separatorText, { color: C.textMuted }]}>ou</Text>
              <View style={[styles.separatorLine, { backgroundColor: C.border }]} />
            </View>

            {/* Bouton Plus tard */}
            <TouchableOpacity
              onPress={() => router.push('/accueil')}
              activeOpacity={0.7}
              style={[styles.outlineBtn, { borderColor: C.border }]}
            >
              <Text style={[styles.outlineBtnText, { color: C.textMuted }]}>Plus tard</Text>
            </TouchableOpacity>
          </View>

          {/* Lien inscription */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: C.textMuted }]}>Pas encore de compte ? </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.footerLink, { color: C.primary }]}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  // Top
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

  // Card
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

  // Labels & inputs
  label: { fontSize: 13, fontWeight: '600', marginBottom: 7 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 13 : 9,
    marginBottom: 18,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },

  // Bouton principal
  primaryBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#F4A623',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  // Séparateur
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 10,
  },
  separatorLine: { flex: 1, height: 1 },
  separatorText: { fontSize: 13 },

  // Bouton outline
  outlineBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  outlineBtnText: { fontSize: 15, fontWeight: '600' },

  // Footer
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
})
