import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useRecipes } from '@/context/RecipesContext'

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
  const { addRecipe } = useRecipes()

  // Champs principaux du formulaire
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [time, setTime] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  // Liste des ingrédients ajoutés
  const [ingredients, setIngredients] = useState<Ingredient[]>([])

  //DEMO : image
  const [image, setImage] = useState('')
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

  // Publie la recette et retourne à l'écran précédent
  function publish() {
    if (!title) return
    addRecipe({
      id: Date.now().toString(),
      title,
      description,
      category: category ?? 'Végés',
      time: time ? `${time} min` : '',
      image: image, //DEMO
      liked: false,
      ingredients: ingredients.map(({ name, quantity, unit }) => ({ name, quantity, unit })),
    })
    console.log('Recipe added:', { title, description, category, time, image, ingredients })
    router.back()
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    time,
    setTime,
    setImage,
    category,
    setCategory,
    ingredients,
    modalVisible,
    setModalVisible,
    addIngredient,
    removeIngredient,
    publish,
    goBack: () => router.back(),
  }
}
