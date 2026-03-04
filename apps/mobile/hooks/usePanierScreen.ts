import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

// Hook UX de l'écran panier (liste de courses).
// Expose les articles à acheter, les articles cochés et toutes les actions
// de gestion, sans aucune dépendance à l'UI.
export function usePanierScreen() {
  const router = useRouter()
  const { items, addItem, toggleCheck, checkAll, clearDone } = useCart()

  // Visibilité de la modale d'ajout d'article manuel
  const [modalVisible, setModalVisible] = useState(false)

  // Articles non encore cochés (à acheter)
  const pending = items.filter(i => !i.checked)
  // Articles cochés (déjà dans le caddie)
  const done = items.filter(i => i.checked)

  // Crée un nouvel article et l'ajoute à la liste de courses
  function handleAdd(name: string, quantity: string, unit: string) {
    addItem({ name, quantity, unit })
  }

  return {
    items,
    toggleCheck,
    checkAll,
    clearDone,
    pending,
    done,
    modalVisible,
    setModalVisible,
    handleAdd,
    goBack: () => router.back(),
  }
}
