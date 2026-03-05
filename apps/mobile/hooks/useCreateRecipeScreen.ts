import { useRouter } from 'expo-router'
import { useState } from 'react'
import { apiClient } from '@/lib/api-client'

// Type représentant un ingrédient dans le formulaire de création
export type Ingredient = {
  id: string
  name: string
  quantity: string
  unit: string
}

// Correspondance entre les labels UI et les valeurs de l'enum API
const CATEGORY_MAP: Record<string, string> = {
  Potages: 'potages',
  Végés: 'végés',
  Viandes: 'viandes',
  Poissons: 'poissons',
  'Plats complets': 'plats complets',
  Desserts: 'desserts',
}

// Hook UX de l'écran de création de recette.
// Centralise le formulaire (titre, description, temps, catégorie, ingrédients)
// et les actions associées, sans aucune dépendance à l'UI.
export function useCreateRecipeScreen() {
  const router = useRouter()

  // Champs principaux du formulaire
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [time, setTime] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  // Liste des ingrédients ajoutés
  const [ingredients, setIngredients] = useState<Ingredient[]>([])

  // Visibilité de la modale d'ajout d'ingrédient
  const [modalVisible, setModalVisible] = useState(false)

  // État de soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Ajoute un ingrédient en lui assignant un identifiant unique basé sur le timestamp
  function addIngredient(ing: Omit<Ingredient, 'id'>) {
    setIngredients(prev => [...prev, { ...ing, id: Date.now().toString() }])
  }

  // Supprime un ingrédient de la liste par son identifiant
  function removeIngredient(id: string) {
    setIngredients(prev => prev.filter(i => i.id !== id))
  }

  // Envoie la recette à l'API puis revient à l'écran précédent
  async function submitRecipe() {
    if (!title.trim() || isSubmitting) return
    try {
      setIsSubmitting(true)
      await apiClient.post('/recipes', {
        name: title.trim(),
        steps: description.trim() || undefined,
        category: category ? (CATEGORY_MAP[category] ?? 'végés') : 'végés',
        ingredients: [],
      })
      router.back()
    } catch (error) {
      console.error('Failed to create recipe:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    time,
    setTime,
    category,
    setCategory,
    ingredients,
    modalVisible,
    setModalVisible,
    addIngredient,
    removeIngredient,
    isSubmitting,
    submitRecipe,
    goBack: () => router.back(),
  }
}
