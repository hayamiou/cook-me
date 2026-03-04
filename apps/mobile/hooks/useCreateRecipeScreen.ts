import { useRouter } from 'expo-router'
import { useState } from 'react'

// Type représentant un ingrédient dans le formulaire de création
export type Ingredient = {
  id: string
  name: string
  quantity: string
  unit: string
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

  // Ajoute un ingrédient en lui assignant un identifiant unique basé sur le timestamp
  function addIngredient(ing: Omit<Ingredient, 'id'>) {
    setIngredients(prev => [...prev, { ...ing, id: Date.now().toString() }])
  }

  // Supprime un ingrédient de la liste par son identifiant
  function removeIngredient(id: string) {
    setIngredients(prev => prev.filter(i => i.id !== id))
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
    goBack: () => router.back(),
  }
}
