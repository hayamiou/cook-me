import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { INITIAL_RECIPES, type Recipe } from '@/data/recipes'
import { apiClient } from '@/lib/api-client'

// Shape returned by GET /recipes (ingredients populated by backend)
type ApiIngredient = { _id: string; title: string; unit: string }
type ApiRecipeIngredient = { ingredient: ApiIngredient | string; quantity: number }
type ApiRecipe = {
  _id: string
  name: string
  category: string
  steps?: string
  isLiked: boolean
  imageKey?: string
  ingredients: ApiRecipeIngredient[]
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1200'

function mapApiRecipe(api: ApiRecipe): Recipe {
  return {
    id: api._id,
    title: api.name,
    category: api.category,
    time: '',
    difficulty: '',
    image: api.imageKey
      ? `${process.env.EXPO_PUBLIC_API_URL}/recipes/${api._id}/image`
      : FALLBACK_IMAGE,
    liked: api.isLiked,
    description: api.steps ?? '',
    ingredients: api.ingredients.map(ri => {
      const ing = ri.ingredient as ApiIngredient
      return {
        name: typeof ing === 'object' ? ing.title : '',
        quantity: String(ri.quantity),
        unit: typeof ing === 'object' ? ing.unit : '',
      }
    }),
  }
}

type RecipesContextType = {
  recipes: Recipe[]
  isLoading: boolean
  error: string | null
  toggleLike: (id: string) => void
  getRecipeById: (id: string) => Recipe | undefined
  refresh: () => Promise<void>
}

const RecipesContext = createContext<RecipesContextType | null>(null)

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiClient.get<ApiRecipe[]>('/recipes')
      setRecipes(data.map(mapApiRecipe))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes')
      // INITIAL_RECIPES stays as fallback on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const toggleLike = useCallback((id: string) => {
    setRecipes(prev =>
      prev.map(recipe => (recipe.id === id ? { ...recipe, liked: !recipe.liked } : recipe)),
    )
  }, [])

  const getRecipeById = useCallback(
    (id: string) => recipes.find(recipe => recipe.id === id),
    [recipes],
  )

  const value = useMemo(
    () => ({ recipes, isLoading, error, toggleLike, getRecipeById, refresh: fetchRecipes }),
    [recipes, isLoading, error, toggleLike, getRecipeById, fetchRecipes],
  )

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
}

export function useRecipes() {
  const ctx = useContext(RecipesContext)
  if (!ctx) throw new Error('useRecipes must be used inside <RecipesProvider>')
  return ctx
}
