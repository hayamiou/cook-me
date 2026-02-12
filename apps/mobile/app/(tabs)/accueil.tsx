import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Dimensions,
  FlatList,
  Image,
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

const { width } = Dimensions.get('window')

// ─── Palettes clair / sombre ─────────────────────────────────────────────────
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
  statusBar: 'light-content' as const,
}

// ─── Données mock ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: '1', label: 'Potages', emoji: '🍲' },
  { id: '2', label: 'Végés', emoji: '🥗' },
  { id: '3', label: 'Viandes', emoji: '🥩' },
  { id: '4', label: 'Poissons', emoji: '🐟' },
  { id: '5', label: 'Pâtes', emoji: '🍝' },
  { id: '6', label: 'Desserts', emoji: '🍰' },
  { id: '7', label: 'Petit-déj', emoji: '🥐' },
]

const RECIPES = []

// ─── Composant Catégorie ─────────────────────────────────────────────────────
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

// ─── Composant Recette ───────────────────────────────────────────────────────
const RecipeCard = ({
  item,
  onToggleLike,
  onAddToCart,
  C,
}: {
  item: (typeof RECIPES)[0]
  onToggleLike: () => void
  onAddToCart: () => void
  C: typeof LIGHT
}) => (
  <View style={[styles.recipeCard, { backgroundColor: C.cardBg }]}>
    <Text style={[styles.recipeTitle, { color: C.text }]}>{item.title}</Text>
    <View style={[styles.recipeImageWrapper, { backgroundColor: C.border }]}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} resizeMode="cover" />
      {/* Like */}
      <TouchableOpacity onPress={onToggleLike} activeOpacity={0.8} style={styles.likeButton}>
        <Ionicons
          name={item.liked ? 'heart' : 'heart-outline'}
          size={22}
          color={item.liked ? C.heart : '#FFFFFF'}
        />
      </TouchableOpacity>
      {/* Meta */}
      <View style={styles.recipeMeta}>
        <View style={styles.recipeMetaItem}>
          <Ionicons name="time-outline" size={13} color="#FFFFFF" />
          <Text style={styles.recipeMetaText}>{item.time}</Text>
        </View>
        <View style={styles.recipeMetaDot} />
        <Text style={styles.recipeMetaText}>{item.difficulty}</Text>
      </View>
      {/* Add to cart */}
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

// ─── Écran principal ─────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter()

  // Lit automatiquement le thème système du téléphone ("light" | "dark" | null)
  const scheme = useColorScheme()
  const C = scheme === 'dark' ? DARK : LIGHT

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [recipes, setRecipes] = React.useState(RECIPES)
  const [searchQuery, setSearchQuery] = React.useState('')

  const toggleLike = (id: string) => {
    setRecipes(prev => prev.map(r => (r.id === id ? { ...r, liked: !r.liked } : r)))
  }

  const filteredRecipes = recipes.filter(r => {
    const matchCat = selectedCategory ? r.category === selectedCategory : true
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      {/* La status bar suit aussi le thème */}
      <StatusBar barStyle={C.statusBar} backgroundColor={C.background} />

      {/* ── Header ── */}
      <View style={[styles.header, { backgroundColor: C.background }]}>
        <TouchableOpacity
          onPress={() => router.push('/profil' as any)}
          activeOpacity={0.7}
          style={styles.headerIcon}
          accessibilityLabel="Profil"
        >
          <Ionicons name="person-circle-outline" size={32} color={C.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: C.text }]}>Cook-Me</Text>

        <TouchableOpacity
          onPress={() => router.push('/cart' as any)}
          activeOpacity={0.7}
          style={styles.headerIcon}
          accessibilityLabel="Panier"
        >
          <Ionicons name="cart-outline" size={30} color={C.text} />
          <View style={[styles.cartBadge, { backgroundColor: C.primary }]}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Barre de recherche ── */}
        <View
          style={[
            styles.searchWrapper,
            {
              backgroundColor: C.searchBg,
              borderColor: C.border,
            },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={C.textMuted} style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher une recette…"
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
          <Text style={[styles.sectionTitle, { color: C.text }]}>Catégories</Text>
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
                {selectedCategory} ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {filteredRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color={C.border} />
            <Text style={[styles.emptyStateText, { color: C.textMuted }]}>
              Aucune recette trouvée
            </Text>
          </View>
        ) : (
          filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              item={recipe}
              onToggleLike={() => toggleLike(recipe.id)}
              onAddToCart={() => {}}
              C={C}
            />
          ))
        )}

        {/* Espace pour le bouton fixe */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── Bouton fixe "Créer une recette" ── */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          onPress={() => router.push('/create-recipe' as any)}
          activeOpacity={0.85}
          style={[styles.fabButton, { backgroundColor: C.primary }]}
          accessibilityLabel="Créer une recette"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.fabButtonText}>Créer une recette</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

// ─── Styles statiques (valeurs qui ne changent pas selon le thème) ────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerIcon: {
    position: 'relative',
    padding: 4,
  },
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
  cartBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
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
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 6,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: 72,
  },
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
  categoryEmoji: {
    fontSize: 28,
  },
  categoryLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  clearFilterBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  clearFilterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recipeCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
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
  recipeImage: {
    width: '100%',
    height: '100%',
  },
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
  recipeMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  recipeMetaText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  recipeMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
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
  addToCartText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: '500',
  },
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
  fabButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
})
