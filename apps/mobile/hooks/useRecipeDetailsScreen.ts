import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCart } from '@/context/CartContext'
import { useRecipes } from '@/context/RecipesContext'
import type { Recipe } from '@/data/recipes'

// Hook UX de l'écran de détail d'une recette.
// Résout la recette depuis les paramètres de route (id ou payload JSON encodé),
// gère la modale de confirmation et l'ajout au panier.
export function useRecipeDetailsScreen() {
  const router = useRouter()
  const { addItems } = useCart()
  const { getRecipeById, toggleLike } = useRecipes()
  const insets = useSafeAreaInsets()

  const params = useLocalSearchParams<{ id?: string; recipe?: string }>()

  // Priorité à l'id (source de vérité du context), fallback sur le payload JSON encodé
  const recipe = useMemo(() => {
    if (params.id) {
      const byId = getRecipeById(params.id)
      if (byId) return byId
    }
    if (params.recipe) {
      try {
        return JSON.parse(decodeURIComponent(params.recipe)) as Recipe
      } catch {
        // payload invalide, retombe sur null
      }
    }
    return null
  }, [getRecipeById, params.id, params.recipe])

  // Visibilité de la modale de confirmation d'ajout au panier
  const [confirmVisible, setConfirmVisible] = useState(false)
  // Toast de succès après ajout
  const [successVisible, setSuccessVisible] = useState(false)

  // Ajoute les ingrédients de la recette au panier et affiche le toast
  function confirmAddToShoppingList() {
    if (!recipe) return
    addItems(recipe.ingredients)
    setConfirmVisible(false)
    setSuccessVisible(true)
    setTimeout(() => setSuccessVisible(false), 2200)
  }

  return {
    recipe,
    insets,
    toggleLike,
    confirmVisible,
    setConfirmVisible,
    successVisible,
    confirmAddToShoppingList,
    goBack: () => router.back(),
  }
}
