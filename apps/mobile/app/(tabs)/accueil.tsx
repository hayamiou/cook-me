import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
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
import { useCart } from '@/context/CartContext'

// ─── Palettes ─────────────────────────────────────────────────────────────────
const LIGHT = {
  primary: '#F4A623',
  primaryLight: '#FDEABF',
  background: '#FAFAF7',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#8A8A8A',
  border: '#EFEFEF',
  heart: '#E05555',
  searchBg: '#FFFFFF',
  cardBg: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.45)',
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
  heart: '#E05555',
  searchBg: '#1E1E1E',
  cardBg: '#1E1E1E',
  overlay: 'rgba(0,0,0,0.65)',
  statusBar: 'light-content' as const,
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Ingredient = { name: string; quantity: string; unit: string }
type Recipe = {
  id: string
  title: string
  category: string
  time: string
  difficulty: string
  image: string
  liked: boolean
  ingredients: Ingredient[]
}

// ─── Données mock ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: '1', label: 'Potages', emoji: '🍲' },
  { id: '2', label: 'Vegés', emoji: '🥗' },
  { id: '3', label: 'Viandes', emoji: '🥩' },
  { id: '4', label: 'Poissons', emoji: '🐟' },
  { id: '5', label: 'Pates', emoji: '🍝' },
  { id: '6', label: 'Desserts', emoji: '🍰' },
  { id: '7', label: 'Petit-dej', emoji: '🥐' },
]

const INITIAL_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Saumon aux haricots verts',
    category: 'Poissons',
    time: '25 min',
    difficulty: 'Facile',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600',
    liked: false,
    ingredients: [
      { name: 'Paves de saumon', quantity: '2', unit: 'piece(s)' },
      { name: 'Haricots verts', quantity: '300', unit: 'g' },
      { name: 'Beurre', quantity: '30', unit: 'g' },
      { name: 'Ail', quantity: '2', unit: 'gousse(s)' },
      { name: 'Citron', quantity: '1', unit: 'piece(s)' },
      { name: 'Huile olive', quantity: '2', unit: 'c. a soupe' },
      { name: 'Sel & poivre', quantity: '1', unit: 'pincee' },
    ],
  },
  {
    id: '2',
    title: 'Veloute de carottes',
    category: 'Potages',
    time: '30 min',
    difficulty: 'Facile',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600',
    liked: false,
    ingredients: [
      { name: 'Carottes', quantity: '500', unit: 'g' },
      { name: 'Oignon', quantity: '1', unit: 'piece(s)' },
      { name: 'Bouillon de legumes', quantity: '750', unit: 'ml' },
      { name: 'Creme fraiche', quantity: '100', unit: 'ml' },
      { name: 'Gingembre frais', quantity: '1', unit: 'c. a cafe' },
      { name: 'Huile olive', quantity: '1', unit: 'c. a soupe' },
    ],
  },
  {
    id: '3',
    title: 'Risotto aux champignons',
    category: 'Vegés',
    time: '40 min',
    difficulty: 'Moyen',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600',
    liked: true,
    ingredients: [
      { name: 'Riz arborio', quantity: '300', unit: 'g' },
      { name: 'Champignons', quantity: '250', unit: 'g' },
      { name: 'Oignon', quantity: '1', unit: 'piece(s)' },
      { name: 'Vin blanc sec', quantity: '150', unit: 'ml' },
      { name: 'Bouillon de legumes', quantity: '1', unit: 'l' },
      { name: 'Parmesan rape', quantity: '60', unit: 'g' },
      { name: 'Beurre', quantity: '40', unit: 'g' },
    ],
  },
  {
    id: '4',
    title: 'Poulet roti aux herbes',
    category: 'Viandes',
    time: '1h10',
    difficulty: 'Facile',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600',
    liked: false,
    ingredients: [
      { name: 'Poulet entier', quantity: '1', unit: 'piece(s)' },
      { name: 'Ail', quantity: '4', unit: 'gousse(s)' },
      { name: 'Romarin', quantity: '3', unit: 'brin(s)' },
      { name: 'Thym', quantity: '3', unit: 'brin(s)' },
      { name: 'Beurre', quantity: '50', unit: 'g' },
      { name: 'Huile olive', quantity: '2', unit: 'c. a soupe' },
      { name: 'Citron', quantity: '1', unit: 'piece(s)' },
    ],
  },
]

// ─── Composant Catégorie ──────────────────────────────────────────────────────
const CategoryItem = ({
  item,
  selected,
  onPress,
  C,
}: {
  item: (typeof CATEGORIES)[0]
  selected: boolean
  onPress: () => void
  C: typeof LIGHT
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

// ─── Composant Recette ────────────────────────────────────────────────────────
const RecipeCard = ({
  item,
  onToggleLike,
  onAddToCart,
  C,
}: {
  item: Recipe
  onToggleLike: () => void
  onAddToCart: () => void
  C: typeof LIGHT
}) => (
  <View style={[styles.recipeCard, { backgroundColor: C.cardBg }]}>
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
        style={[styles.addToCartBadge, { backgroundColor: C.primary }]}
      >
        <Ionicons name="cart-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
        <Text style={styles.addToCartText}>Ajouter aux courses</Text>
      </TouchableOpacity>
    </View>
  </View>
)

// ─── Écran principal ──────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter()
  const scheme = useColorScheme()
  const C = scheme === 'dark' ? DARK : LIGHT

  const { addItems, pendingCount } = useCart()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES)
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmRecipe, setConfirmRecipe] = useState<Recipe | null>(null)
  const [successVisible, setSuccessVisible] = useState(false)

  const toggleLike = (id: string) =>
    setRecipes(prev => prev.map(r => (r.id === id ? { ...r, liked: !r.liked } : r)))

  // Ouvre la popup de confirmation
  const handleAddToCart = (recipe: Recipe) => setConfirmRecipe(recipe)

  // Valide l'ajout
  const confirmAdd = () => {
    if (!confirmRecipe) return
    addItems(confirmRecipe.ingredients)

    setConfirmRecipe(null)

    setSuccessVisible(true)
    setTimeout(() => setSuccessVisible(false), 2500)
  }

  const filteredRecipes = recipes.filter(r => {
    const matchCat = selectedCategory ? r.category === selectedCategory : true
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <StatusBar barStyle={C.statusBar} backgroundColor={C.background} />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: C.background }]}>
        <TouchableOpacity
          onPress={() => router.push('/profil')}
          activeOpacity={0.7}
          style={styles.headerIcon}
          accessibilityLabel="Profil"
        >
          <Ionicons name="person-circle-outline" size={32} color={C.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: C.text }]}>Cook-Me</Text>

        <TouchableOpacity
          onPress={() => router.push('/panier')}
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
        {/* ── Recherche ── */}
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
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Catégories ── */}
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
              onPress={() => setSelectedCategory(prev => (prev === item.label ? null : item.label))}
              C={C}
            />
          )}
        />

        {/* ── Recettes ── */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Recettes</Text>
          {selectedCategory && (
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
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
              C={C}
            />
          ))
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── FAB ── */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          onPress={() => router.push('/create-recipe')}
          activeOpacity={0.85}
          style={[styles.fabButton, { backgroundColor: C.primary }]}
          accessibilityLabel="Creer une recette"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.fabButtonText}>Creer une recette</Text>
        </TouchableOpacity>
      </View>

      {/* ── Popup confirmation ── */}
      <Modal
        visible={confirmRecipe !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmRecipe(null)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: C.overlay }]}
          onPress={() => setConfirmRecipe(null)}
        >
          <Pressable style={[styles.modalCard, { backgroundColor: C.surface }]}>
            {/* Icone */}
            <View style={[styles.modalIconCircle, { backgroundColor: C.primaryLight }]}>
              <Ionicons name="cart-outline" size={30} color={C.primary} />
            </View>

            <Text style={[styles.modalTitle, { color: C.text }]}>Ajouter au panier ?</Text>
            <Text style={[styles.modalDesc, { color: C.textMuted }]}>
              {confirmRecipe
                ? confirmRecipe.ingredients.length +
                  ' ingredients de "' +
                  confirmRecipe.title +
                  '" seront ajoutes a ta liste de courses.'
                : ''}
            </Text>

            {/* Liste rapide des ingredients */}
            {confirmRecipe && (
              <View
                style={[
                  styles.ingredientPreview,
                  { backgroundColor: C.background, borderColor: C.border },
                ]}
              >
                {confirmRecipe.ingredients.slice(0, 4).map((ing, i) => (
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

            {/* Boutons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setConfirmRecipe(null)}
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

      {/* ── Toast succes ── */}
      {successVisible && (
        <View style={[styles.toast, { backgroundColor: C.surface, borderColor: C.primary }]}>
          <Ionicons name="checkmark-circle" size={20} color={C.primary} />
          <Text style={[styles.toastText, { color: C.text }]}>Ingredients ajoutes au panier !</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  categoryEmoji: { fontSize: 28 },
  categoryLabel: { marginTop: 6, fontSize: 12, fontWeight: '500', textAlign: 'center' },
  clearFilterBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  clearFilterText: { fontSize: 12, fontWeight: '600' },
  recipeCard: { marginHorizontal: 20, marginBottom: 20 },
  recipeTitle: { fontSize: 15, fontWeight: '600', marginBottom: 3 },
  recipeIngredientsSummary: { fontSize: 12, marginBottom: 8 },
  recipeImageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 190,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
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
  recipeMeta: {
    position: 'absolute',
    bottom: 44,
    left: 12,
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
  addToCartBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  addToCartText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyStateText: { fontSize: 15, fontWeight: '500' },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
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
    paddingVertical: 15,
    paddingHorizontal: 36,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#F4A623',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  fabButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },

  // ── Modal confirmation ──
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: { elevation: 12 },
    }),
  },
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

  // ── Toast succes ──
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  toastText: { fontSize: 14, fontWeight: '600' },
})
