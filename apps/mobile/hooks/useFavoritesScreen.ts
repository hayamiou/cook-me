import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRecipes } from '@/context/RecipesContext'
import type { Recipe } from '@/data/recipes'

// Hook UX de l'écran des favoris.
// Dérive la liste des recettes likées et gère les actions panier et navigation,
// sans aucune dépendance à l'UI.
export function useFavoritesScreen() {
  const router = useRouter()
  const { addItems } = useCart()
  const { recipes, toggleLike } = useRecipes()

  // Toast de succès après ajout au panier
  const [successVisible, setSuccessVisible] = useState(false)

  // Sous-ensemble des recettes marquées comme favorites
  const favorites = recipes.filter(recipe => recipe.liked)

  // Navigue vers le détail d'une recette
  function openRecipe(recipe: Recipe) {
    router.push({ pathname: '/recette/[id]', params: { id: recipe.id } } as never)
  }

  // Ajoute les ingrédients d'une recette au panier et affiche le toast
  function addRecipeToCart(recipe: Recipe) {
    addItems(recipe.ingredients)
    setSuccessVisible(true)
    setTimeout(() => setSuccessVisible(false), 2200)
  }

  return { favorites, toggleLike, successVisible, openRecipe, addRecipeToCart }
}
