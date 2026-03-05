import { Ionicons } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import {
  Image,
  Modal,
  Pressable,
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
import { useRecipeDetailsScreen } from '@/hooks/useRecipeDetailsScreen'

// Écran de détail d'une recette — responsabilité UI uniquement.
// Toute la logique (résolution de la recette, panier, navigation) est déléguée à useRecipeDetailsScreen.
export default function RecipeDetailsScreen() {
  const scheme = useColorScheme()
  // Palette de couleurs selon le thème système
  const C = scheme === 'dark' ? DARK : LIGHT

  const {
    recipe,
    insets,
    toggleLike,
    confirmVisible,
    setConfirmVisible,
    successVisible,
    confirmAddToShoppingList,
    goBack,
  } = useRecipeDetailsScreen()

  // Écran de fallback si la recette est introuvable
  if (!recipe) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.missingContainer}>
          <Text style={[styles.missingTitle, { color: C.text }]}>Recette introuvable</Text>
          <TouchableOpacity
            onPress={goBack}
            activeOpacity={0.85}
            style={[styles.missingButton, { backgroundColor: C.primary }]}
          >
            <Text style={styles.missingButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={C.statusBar} backgroundColor={C.background} />

      {/* En-tête : titre + bouton favoris */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backTitleWrap} onPress={goBack} activeOpacity={0.75}>
          <Ionicons name="chevron-back" size={20} color={C.text} />
          <Text numberOfLines={1} style={[styles.recipeTitle, { color: C.text }]}>
            {recipe.title}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleLike(recipe.id)}
          activeOpacity={0.75}
          accessibilityLabel="Ajouter aux favoris"
          style={styles.heartBtn}
        >
          <Ionicons
            name={recipe.liked ? 'heart' : 'heart-outline'}
            size={24}
            color={recipe.liked ? C.heart : C.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {!!recipe.image && (
          <Image source={{ uri: recipe.image }} style={styles.cover} resizeMode="cover" />
        )}

        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={18} color={C.textMuted} />
          <Text style={[styles.timeText, { color: C.textMuted }]}>
            Temps de preparation : {recipe.time}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: C.text }]}>Ingredients</Text>
        <View style={[styles.sectionBox, { backgroundColor: C.surface, borderColor: C.border }]}>
          {recipe.ingredients.map(ingredient => (
            <Text key={ingredient.name} style={[styles.ingredientText, { color: C.text }]}>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </Text>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: C.text }]}>Description</Text>
        <View style={[styles.sectionBox, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[styles.descriptionText, { color: C.text }]}>{recipe.description}</Text>
        </View>

        <View style={{ height: 110 + insets.bottom }} />
      </ScrollView>

      {/* Bouton fixe en bas : ajout à la liste de courses */}
      <View
        style={[
          styles.bottomArea,
          { backgroundColor: C.background, paddingBottom: Math.max(insets.bottom, 14) },
        ]}
      >
        <TouchableOpacity
          onPress={() => setConfirmVisible(true)}
          activeOpacity={0.85}
          style={[styles.bottomButton, { backgroundColor: C.primary }]}
        >
          <Ionicons name="add" size={18} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.bottomButtonText}>Ajouter les ingredients a la liste de course</Text>
        </TouchableOpacity>
      </View>

      {/* Modale de confirmation d'ajout au panier */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: C.overlay }]}
          onPress={() => setConfirmVisible(false)}
        >
          <Pressable style={[styles.modalCard, { backgroundColor: C.surface }]}>
            <View style={[styles.modalIconCircle, { backgroundColor: C.primaryLight }]}>
              <Ionicons name="cart-outline" size={30} color={C.primary} />
            </View>

            <Text style={[styles.modalTitle, { color: C.text }]}>Ajouter au panier ?</Text>
            <Text style={[styles.modalDesc, { color: C.textMuted }]}>
              {recipe.ingredients.length} ingredients de "{recipe.title}" seront ajoutes a ta liste
              de courses.
            </Text>

            <View
              style={[
                styles.ingredientPreview,
                { backgroundColor: C.background, borderColor: C.border },
              ]}
            >
              {recipe.ingredients.slice(0, 4).map(ing => (
                <View key={ing.name} style={styles.ingredientPreviewRow}>
                  <View style={[styles.ingredientDot, { backgroundColor: C.primary }]} />
                  <Text style={[styles.ingredientPreviewText, { color: C.text }]}>
                    {ing.quantity} {ing.unit} {ing.name}
                  </Text>
                </View>
              ))}
              {recipe.ingredients.length > 4 && (
                <Text style={[styles.ingredientMore, { color: C.textMuted }]}>
                  + {recipe.ingredients.length - 4} autre(s)...
                </Text>
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setConfirmVisible(false)}
                style={[styles.modalCancelBtn, { borderColor: C.border }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalCancelText, { color: C.textMuted }]}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmAddToShoppingList}
                style={[styles.modalConfirmBtn, { backgroundColor: C.primary }]}
                activeOpacity={0.85}
              >
                <Ionicons name="cart" size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalConfirmText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Toast de confirmation */}
      {successVisible && (
        <View style={[styles.toast, { backgroundColor: C.surface, borderColor: C.primary }]}>
          <Ionicons name="checkmark-circle" size={20} color={C.primary} />
          <Text style={[styles.toastText, { color: C.text }]}>Ingredients ajoutes au panier</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 12,
  },
  backTitleWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 },
  recipeTitle: { fontSize: 27, fontWeight: '700', marginLeft: 2, flexShrink: 1 },
  heartBtn: { padding: 4 },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  cover: { width: '100%', height: 280, borderRadius: 10, marginBottom: 16 },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 6 },
  timeText: { fontSize: 15, fontWeight: '500' },
  sectionTitle: { fontSize: 30, fontWeight: '700', marginBottom: 10 },
  sectionBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    gap: 6,
  },
  ingredientText: { fontSize: 16, lineHeight: 22 },
  descriptionText: { fontSize: 16, lineHeight: 24 },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  bottomButton: {
    borderRadius: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalCard: { width: '100%', borderRadius: 24, padding: 24, alignItems: 'center' },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  modalDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  ingredientPreview: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
    gap: 6,
  },
  ingredientPreviewRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ingredientDot: { width: 6, height: 6, borderRadius: 3 },
  ingredientPreviewText: { fontSize: 13, fontWeight: '500' },
  ingredientMore: { fontSize: 12, marginTop: 4, textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '600' },
  modalConfirmBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  toast: {
    position: 'absolute',
    bottom: 96,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  toastText: { fontSize: 14, fontWeight: '600' },
  missingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  missingTitle: { fontSize: 22, fontWeight: '700' },
  missingButton: { borderRadius: 18, paddingHorizontal: 22, paddingVertical: 10 },
  missingButtonText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
})
