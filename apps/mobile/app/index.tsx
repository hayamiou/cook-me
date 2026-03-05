import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
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
import { DARK, LIGHT } from '@/constants/theme'
import { useLoginScreen } from '@/hooks/useLoginScreen'

// Écran de connexion — responsabilité UI uniquement.
// Toute la logique (états, navigation) est déléguée à useLoginScreen.
export default function LoginScreen() {
  const scheme = useColorScheme()
  // Palette de couleurs selon le thème système
  const C = scheme === 'dark' ? DARK : LIGHT
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPwd,
    toggleShowPwd,
    isFormValid,
    onLogin,
    onSkip,
  } = useLoginScreen()

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
            <Text style={[styles.cardTitle, { color: C.text }]}>Inscription</Text>
            <Text style={[styles.cardDesc, { color: C.textMuted }]}>Saisis tes informations</Text>

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
              <TouchableOpacity onPress={toggleShowPwd} activeOpacity={0.7}>
                <Ionicons
                  name={showPwd ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={C.textMuted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.replace('./(tabs)/accueil')}
              activeOpacity={0.85}
              style={[
                styles.primaryBtn,
                { backgroundColor: isFormValid ? C.primary : C.primaryLight },
              ]}
            >
              <Text style={styles.primaryBtnText}>Se connecter</Text>
            </TouchableOpacity>

            <View style={styles.separatorRow}>
              <View style={[styles.separatorLine, { backgroundColor: C.border }]} />
              <Text style={[styles.separatorText, { color: C.textMuted }]}>ou</Text>
              <View style={[styles.separatorLine, { backgroundColor: C.border }]} />
            </View>

            <TouchableOpacity
              onPress={onSkip}
              activeOpacity={0.7}
              style={[styles.outlineBtn, { borderColor: C.border }]}
            >
              <Text style={[styles.outlineBtnText, { color: C.textMuted }]}>Plus tard</Text>
            </TouchableOpacity>
          </View>

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
  input: { flex: 1, fontSize: 15, padding: 0 },
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
  separatorRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 10 },
  separatorLine: { flex: 1, height: 1 },
  separatorText: { fontSize: 13 },
  outlineBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1 },
  outlineBtnText: { fontSize: 15, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
})
