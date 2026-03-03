import type React from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { INITIAL_RECIPES, type Recipe } from '@/data/recipes'

type RecipesContextType = {
  recipes: Recipe[]
  toggleLike: (id: string) => void
  getRecipeById: (id: string) => Recipe | undefined
}

const RecipesContext = createContext<RecipesContextType | null>(null)

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES)

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
    () => ({ recipes, toggleLike, getRecipeById }),
    [recipes, toggleLike, getRecipeById],
  )

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
}

export function useRecipes() {
  const ctx = useContext(RecipesContext)
  if (!ctx) throw new Error('useRecipes must be used inside <RecipesProvider>')
  return ctx
}
