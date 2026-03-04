import { Ionicons } from '@expo/vector-icons'
import {
  Image,
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
import type { Recipe } from '@/data/recipes'
import { useFavoritesScreen } from '@/hooks/useFavoritesScreen'

// Composant UI : carte d'une recette favorite
const FavoriteRecipeCard = ({
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
          <Ionicons name="heart" size={22} color={C.heart} />
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

// Écran des favoris — responsabilité UI uniquement.
// Toute la logique (filtrage, panier, navigation) est déléguée à useFavoritesScreen.
export default function FavoritesScreen() {
  const scheme = useColorScheme()
  // Palette de couleurs selon le thème système
  const C = scheme === 'dark' ? DARK : LIGHT

  const { favorites, toggleLike, successVisible, openRecipe, addRecipeToCart } =
    useFavoritesScreen()

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safe, { backgroundColor: C.background }]}
    >
      <StatusBar barStyle={C.statusBar} backgroundColor={C.background} />

      <View style={[styles.header, { backgroundColor: C.background }]}>
        <Text style={[styles.headerTitle, { color: C.text }]}>Mes favoris</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-dislike-outline" size={56} color={C.border} />
            <Text style={[styles.emptyTitle, { color: C.text }]}>Aucune recette favorite</Text>
            <Text style={[styles.emptyDesc, { color: C.textMuted }]}>
              Ajoute un coeur depuis l accueil pour voir tes recettes ici.
            </Text>
          </View>
        ) : (
          favorites.map(recipe => (
            <FavoriteRecipeCard
              key={recipe.id}
              item={recipe}
              onToggleLike={() => toggleLike(recipe.id)}
              onAddToCart={() => addRecipeToCart(recipe)}
              onOpen={() => openRecipe(recipe)}
              C={C}
            />
          ))
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

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
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 26, fontWeight: '700' },
  scrollContent: { paddingBottom: 20 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
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
