import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
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
import { useAuth } from '@/contexts/AuthContext'
import type { Recipe } from '@/data/recipes'
import { useHomeScreen } from '@/hooks/useHomeScreen'

// Catégories disponibles pour filtrer les recettes
const CATEGORIES = [
  { id: '1', label: 'Potages', emoji: '🍲' },
  { id: '2', label: 'Vegés', emoji: '🥗' },
  { id: '3', label: 'Viandes', emoji: '🥩' },
  { id: '4', label: 'Poissons', emoji: '🐟' },
  { id: '5', label: 'Pates', emoji: '🍝' },
  { id: '6', label: 'Desserts', emoji: '🍰' },
  { id: '7', label: 'Petit-dej', emoji: '🥐' },
]

// Composant UI : pastille de catégorie dans la liste horizontale
const CategoryItem = ({
  item,
  selected,
  onPress,
  C,
}: {
  item: (typeof CATEGORIES)[0]
  selected: boolean
  onPress: () => void
  C: typeof LIGHT | typeof DARK
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.categoryItem}>
    <View
      style={[
        styles.categoryCircle,
        { backgroundColor: C.surface, borderColor: C.border },
        selected && { borderColor: C.primary, backgroundColor: C.primaryLight },
      ]}
    >
      <Text style={styles.categoryEmoji}>{item.emoji}</Text>
    </View>
    <Text
      style={[
        styles.categoryLabel,
        { color: C.textMuted },
        selected && { color: C.primary, fontWeight: '700' },
      ]}
    >
      {item.label}
    </Text>
  </TouchableOpacity>
)

// Composant UI : carte d'une recette dans le feed
const RecipeCard = ({
  item,
  onToggleLike,
  onAddToCart,
  onOpen,
  C,
}: {
  item: Recipe
  onToggleLike: () => void
  onAddToCart: () => void
  onOpen: () => void
  C: typeof LIGHT | typeof DARK
}) => (
  <View style={[styles.recipeCard, { backgroundColor: C.cardBg }]}>
    <TouchableOpacity activeOpacity={0.9} onPress={onOpen}>
      <Text style={[styles.recipeTitle, { color: C.text }]}>{item.title}</Text>
      <Text style={[styles.recipeIngredientsSummary, { color: C.textMuted }]}>
        {item.ingredients
          .slice(0, 3)
          .map(i => i.name)
          .join(', ')}
        {item.ingredients.length > 3 ? `+${item.ingredients.length - 3}` : ''}
      </Text>

      <View style={[styles.recipeImageWrapper, { backgroundColor: C.border }]}>
        <Image source={{ uri: item.image }} style={styles.recipeImage} resizeMode="cover" />

        <TouchableOpacity onPress={onToggleLike} activeOpacity={0.8} style={styles.likeButton}>
          <Ionicons
            name={item.liked ? 'heart' : 'heart-outline'}
            size={22}
            color={item.liked ? C.heart : '#FFFFFF'}
          />
        </TouchableOpacity>

        <View style={styles.imageBottomRow}>
          <View style={styles.recipeMeta}>
            <View style={styles.recipeMetaItem}>
              <Ionicons name="time-outline" size={13} color="#FFFFFF" />
              <Text style={styles.recipeMetaText}>{item.time}</Text>
            </View>
            <View style={styles.recipeMetaDot} />
            <Text style={styles.recipeMetaText}>{item.difficulty}</Text>
            <View style={styles.recipeMetaDot} />
            <Text style={styles.recipeMetaText}>{item.ingredients.length} ingr.</Text>
          </View>

          <TouchableOpacity
            onPress={onAddToCart}
            activeOpacity={0.85}
            style={[styles.addToCartBtn, { backgroundColor: C.primary }]}
          >
            <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  </View>
)

// Écran d'accueil — responsabilité UI uniquement.
// Toute la logique (filtrage, panier, navigation) est déléguée à useHomeScreen.
export default function HomeScreen() {
  const scheme = useColorScheme()
  const router = useRouter()
  // Palette de couleurs selon le thème système
  const C = scheme === 'dark' ? DARK : LIGHT
  const { isAuthenticated, isLoading } = useAuth()

  // Redirection si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  const {
    toggleLike,
    pendingCount,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    confirmRecipe,
    successVisible,
    filteredRecipes,
    openRecipe,
    handleAddToCart,
    confirmAdd,
    cancelConfirm,
    toggleCategory,
    clearCategory,
    clearSearch,
    goToProfile,
    goToCart,
    goToCreateRecipe,
  } = useHomeScreen()

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safe, { backgroundColor: C.background }]}
    >
      <StatusBar barStyle={C.statusBar} backgroundColor={C.background} />

      <View style={[styles.header, { backgroundColor: C.background }]}>
        <TouchableOpacity
          onPress={goToProfile}
          activeOpacity={0.7}
          style={styles.headerIcon}
          accessibilityLabel="Profil"
        >
          <Ionicons name="person-circle-outline" size={32} color={C.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: C.text }]}>Cook-Me</Text>

        <TouchableOpacity
          onPress={goToCart}
          activeOpacity={0.7}
          style={styles.headerIcon}
          accessibilityLabel="Panier"
        >
          <Ionicons name="cart-outline" size={30} color={C.text} />
          {pendingCount > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: C.primary }]}>
              <Text style={styles.cartBadgeText}>{pendingCount > 99 ? '99+' : pendingCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View
          style={[styles.searchWrapper, { backgroundColor: C.searchBg, borderColor: C.border }]}
        >
          <Ionicons name="search-outline" size={18} color={C.textMuted} style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher une recette..."
            placeholderTextColor={C.textMuted}
            style={[styles.searchInput, { color: C.text }]}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Categories</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={20} color={C.textMuted} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={CATEGORIES}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <CategoryItem
              item={item}
              selected={selectedCategory === item.label}
              onPress={() => toggleCategory(item.label)}
              C={C}
            />
          )}
        />

        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Recettes</Text>
          {selectedCategory && (
            <TouchableOpacity
              onPress={clearCategory}
              activeOpacity={0.7}
              style={[styles.clearFilterBadge, { backgroundColor: C.primaryLight }]}
            >
              <Text style={[styles.clearFilterText, { color: C.primary }]}>
                {selectedCategory} x
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {filteredRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color={C.border} />
            <Text style={[styles.emptyStateText, { color: C.textMuted }]}>
              Aucune recette trouvee
            </Text>
          </View>
        ) : (
          filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              item={recipe}
              onToggleLike={() => toggleLike(recipe.id)}
              onAddToCart={() => handleAddToCart(recipe)}
              onOpen={() => openRecipe(recipe)}
              C={C}
            />
          ))
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity
          onPress={goToCreateRecipe}
          activeOpacity={0.85}
          style={[styles.fabButton, { backgroundColor: C.primary }]}
          accessibilityLabel="Creer une recette"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.fabButtonText}>Creer une recette</Text>
        </TouchableOpacity>
      </View>

      {/* Modale de confirmation d'ajout au panier */}
      <Modal
        visible={confirmRecipe !== null}
        transparent
        animationType="fade"
        onRequestClose={cancelConfirm}
      >
        <Pressable style={styles.modalOverlay} onPress={cancelConfirm}>
          <Pressable style={[styles.modalCard, { backgroundColor: C.surface }]}>
            <View style={[styles.modalIconCircle, { backgroundColor: C.primaryLight }]}>
              <Ionicons name="cart-outline" size={30} color={C.primary} />
            </View>

            <Text style={[styles.modalTitle, { color: C.text }]}>Ajouter au panier ?</Text>
            <Text style={[styles.modalDesc, { color: C.textMuted }]}>
              {confirmRecipe
                ? `${confirmRecipe.ingredients.length} ingredients de "${confirmRecipe.title}" seront ajoutes a ta liste de courses.`
                : ''}
            </Text>

            {confirmRecipe && (
              <View
                style={[
                  styles.ingredientPreview,
                  { backgroundColor: C.background, borderColor: C.border },
                ]}
              >
                {confirmRecipe.ingredients.slice(0, 4).map(ing => (
                  <View key={ing.name} style={styles.ingredientPreviewRow}>
                    <View style={[styles.ingredientDot, { backgroundColor: C.primary }]} />
                    <Text style={[styles.ingredientPreviewText, { color: C.text }]}>
                      {ing.quantity} {ing.unit} {ing.name}
                    </Text>
                  </View>
                ))}
                {confirmRecipe.ingredients.length > 4 && (
                  <Text style={[styles.ingredientMore, { color: C.textMuted }]}>
                    + {confirmRecipe.ingredients.length - 4} autre(s)...
                  </Text>
                )}
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={cancelConfirm}
                style={[styles.modalCancelBtn, { borderColor: C.border }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalCancelText, { color: C.textMuted }]}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmAdd}
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
          <Text style={[styles.toastText, { color: C.text }]}>Ingredients ajoutes au panier !</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: 0.5 },
  headerIcon: { position: 'relative', padding: 4 },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { fontSize: 9, fontWeight: '700', color: '#FFFFFF' },
  scrollContent: { paddingBottom: 20 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 1,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  categoriesList: { paddingHorizontal: 16, paddingBottom: 20, gap: 6 },
  categoryItem: { alignItems: 'center', marginHorizontal: 6, width: 72 },
  categoryCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  categoryEmoji: { fontSize: 28 },
  categoryLabel: { marginTop: 6, fontSize: 12, fontWeight: '500', textAlign: 'center' },
  clearFilterBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  clearFilterText: { fontSize: 12, fontWeight: '600' },
  recipeCard: { marginHorizontal: 20, marginBottom: 20, borderRadius: 16 },
  recipeTitle: { fontSize: 15, fontWeight: '600', marginTop: 5, marginBottom: 3, paddingLeft: 14 },
  recipeIngredientsSummary: { fontSize: 12, marginBottom: 8, paddingLeft: 14 },
  recipeImageWrapper: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    height: 190,
    position: 'relative',
  },
  recipeImage: { width: '100%', height: '100%' },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    padding: 7,
  },
  imageBottomRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  recipeMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  recipeMetaText: { fontSize: 11, color: '#FFFFFF', fontWeight: '500' },
  recipeMetaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' },
  addToCartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyStateText: { fontSize: 15, fontWeight: '500' },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 8 : 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 75,
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 36,
    width: '100%',
  },
  fabButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    bottom: Platform.OS === 'ios' ? 110 : 90,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1.5,
  },
  toastText: { fontSize: 14, fontWeight: '600' },
})
