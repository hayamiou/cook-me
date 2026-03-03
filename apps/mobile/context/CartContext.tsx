import type React from 'react'
import { createContext, useContext, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
export type CartItem = {
  id: string
  name: string
  quantity: string
  unit: string
  checked: boolean
}

type CartContextType = {
  items: CartItem[]
  addItems: (newItems: Omit<CartItem, 'id' | 'checked'>[]) => void
  addItem: (item: Omit<CartItem, 'id' | 'checked'>) => void
  toggleCheck: (id: string) => void
  checkAll: () => void
  clearDone: () => void
  removeItem: (id: string) => void
  pendingCount: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Normalise le nom pour la comparaison (minuscules, sans accents, sans espaces superflus)
const normalizeName = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .replace(/[^a-z0-9]/g, '') // garde seulement alphanum
    .trim()

// Tente de parser une quantité en nombre, retourne null si impossible
const parseQty = (qty: string): number | null => {
  const n = parseFloat(qty.replace(',', '.'))
  return Number.isNaN(n) ? null : n
}

// Fusionne un nouvel article avec le tableau existant :
// - Si même nom ET même unité → additionne les quantités
// - Si même nom ET unités différentes mais toutes deux numériques → additionne quand même
//   et garde l'unité de l'existant (ex : 1 tomate + 1 tomate = 2 tomates)
// - Sinon → ajoute comme nouvel article séparé
const mergeItem = (prev: CartItem[], incoming: Omit<CartItem, 'id' | 'checked'>): CartItem[] => {
  const incomingNorm = normalizeName(incoming.name)
  const incomingQty = parseQty(incoming.quantity)

  // Cherche un article existant non coché avec le même nom normalisé
  const existingIndex = prev.findIndex(i => !i.checked && normalizeName(i.name) === incomingNorm)

  if (existingIndex === -1) {
    // Pas de doublon → simple ajout
    return [...prev, { ...incoming, id: `${Date.now()}-${Math.random()}`, checked: false }]
  }

  const existing = prev[existingIndex]
  const existingQty = parseQty(existing.quantity)

  // Les deux quantités sont numériques → on peut additionner
  if (existingQty !== null && incomingQty !== null) {
    const sum = existingQty + incomingQty

    // Formatage propre : pas de décimale inutile (800 au lieu de 800.0)
    const formattedSum = Number.isInteger(sum) ? String(sum) : sum.toFixed(1).replace('.0', '')

    // Garde l'unité de l'article existant (priorité à ce qui est déjà dans le panier)
    const mergedUnit = existing.unit || incoming.unit

    const updated = [...prev]
    updated[existingIndex] = {
      ...existing,
      quantity: formattedSum,
      unit: mergedUnit,
    }
    return updated
  }

  // Quantités non numériques (ex: "au goût") → ajout séparé pour ne pas perdre d'info
  return [...prev, { ...incoming, id: `${Date.now()}-${Math.random()}`, checked: false }]
}

// ─── Contexte ─────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Ajoute plusieurs ingrédients d'un coup avec fusion intelligente
  const addItems = (newItems: Omit<CartItem, 'id' | 'checked'>[]) => {
    setItems(prev => {
      let result = [...prev]
      for (const item of newItems) {
        result = mergeItem(result, item)
      }
      return result
    })
  }

  // Ajoute un seul article avec fusion intelligente
  const addItem = (item: Omit<CartItem, 'id' | 'checked'>) => {
    setItems(prev => mergeItem(prev, item))
  }

  const toggleCheck = (id: string) =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, checked: !i.checked } : i)))

  const checkAll = () => setItems(prev => prev.map(i => ({ ...i, checked: true })))

  const clearDone = () => setItems(prev => prev.filter(i => !i.checked))

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const pendingCount = items.filter(i => !i.checked).length

  return (
    <CartContext.Provider
      value={{
        items,
        addItems,
        addItem,
        toggleCheck,
        checkAll,
        clearDone,
        removeItem,
        pendingCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
