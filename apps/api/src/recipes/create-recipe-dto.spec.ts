import { createRecipeDtoSchema } from '@cook-me/schemas'
import { describe, expect, it } from 'vitest'

const validBase = {
  name: 'Tarte aux pommes',
  category: 'desserts' as const,
  steps: 'Éplucher, cuire, déguster.',
}

describe('createRecipeDtoSchema', () => {
  describe('ingredients (optionnel)', () => {
    it('accepte un body sans le champ ingredients → défaut []', () => {
      const result = createRecipeDtoSchema.safeParse(validBase)
      expect(result.success).toBe(true)
      if (result.success) expect(result.data.ingredients).toEqual([])
    })

    it('accepte un body avec ingredients vide', () => {
      const result = createRecipeDtoSchema.safeParse({ ...validBase, ingredients: [] })
      expect(result.success).toBe(true)
    })
  })

  describe('name (requis)', () => {
    it('rejette un body sans name', () => {
      const result = createRecipeDtoSchema.safeParse({ category: 'desserts' })
      expect(result.success).toBe(false)
    })

    it('rejette un name vide', () => {
      const result = createRecipeDtoSchema.safeParse({ ...validBase, name: '   ' })
      expect(result.success).toBe(false)
    })
  })

  describe('category (enum)', () => {
    it('accepte toutes les catégories valides', () => {
      const categories = ['potages', 'végés', 'viandes', 'poissons', 'plats complets', 'desserts']
      for (const category of categories) {
        const result = createRecipeDtoSchema.safeParse({ ...validBase, category })
        expect(result.success, `category "${category}" devrait être valide`).toBe(true)
      }
    })

    it('rejette une catégorie inconnue', () => {
      const result = createRecipeDtoSchema.safeParse({ ...validBase, category: 'Pâtes' })
      expect(result.success).toBe(false)
    })
  })

  describe('steps (optionnel)', () => {
    it('accepte un body sans steps', () => {
      const { steps: _, ...withoutSteps } = validBase
      const result = createRecipeDtoSchema.safeParse(withoutSteps)
      expect(result.success).toBe(true)
    })
  })
})
