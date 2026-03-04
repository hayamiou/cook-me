import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRecipes } from '@/context/RecipesContext'
import type { Recipe } from '@/data/recipes'

// Hook UX de l'écran d'accueil.
// Gère la recherche, le filtrage par catégorie, l'ajout au panier
// et les navigations, sans aucune dépendance à l'UI.
export function useHomeScreen() {
  const router = useRouter()
  const { recipes, toggleLike } = useRecipes()
  const { addItems, pendingCount } = useCart()

  // Filtres de la liste de recettes
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Recette en attente de confirmation d'ajout au panier
  const [confirmRecipe, setConfirmRecipe] = useState<Recipe | null>(null)
  // Toast de succès après ajout au panier
  const [successVisible, setSuccessVisible] = useState(false)

  // Recettes filtrées selon la catégorie sélectionnée et la recherche textuelle
  const filteredRecipes = recipes.filter(r => {
    const matchCat = selectedCategory ? r.category === selectedCategory : true
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  // Navigue vers le détail d'une recette
  function openRecipe(recipe: Recipe) {
    router.push({
      pathname: '/recette/[id]',
      params: { id: recipe.id, recipe: encodeURIComponent(JSON.stringify(recipe)) },
    } as never)
  }

  // Ouvre la modale de confirmation d'ajout au panier
  function handleAddToCart(recipe: Recipe) {
    setConfirmRecipe(recipe)
  }

  // Confirme l'ajout des ingrédients et déclenche le toast de succès
  function confirmAdd() {
    if (!confirmRecipe) return
    addItems(confirmRecipe.ingredients)
    setConfirmRecipe(null)
    setSuccessVisible(true)
    setTimeout(() => setSuccessVisible(false), 2500)
  }

  // Ferme la modale de confirmation sans ajouter
  function cancelConfirm() {
    setConfirmRecipe(null)
  }

  // Active ou désactive le filtre d'une catégorie (toggle)
  function toggleCategory(label: string) {
    setSelectedCategory(prev => (prev === label ? null : label))
  }

  // Réinitialise le filtre catégorie actif
  function clearCategory() {
    setSelectedCategory(null)
  }

  // Vide le champ de recherche
  function clearSearch() {
    setSearchQuery('')
  }

  return {
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
    goToProfile: () => router.push('/profil'),
    goToCart: () => router.push('/panier'),
    goToCreateRecipe: () => router.push('/create-recipe'),
  }
}
