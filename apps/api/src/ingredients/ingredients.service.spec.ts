import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IngredientsService } from './ingredients.service'
import { Ingredient } from './schemas/ingredient.schema'

const mockIngredients = [
  { _id: '1', title: 'Farine', unit: 'grammes' },
  { _id: '2', title: 'Lait', unit: 'litres' },
]

const mockIngredientModel = {
  find: vi.fn(),
}

describe('IngredientsService', () => {
  let service: IngredientsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IngredientsService,
        { provide: getModelToken(Ingredient.name), useValue: mockIngredientModel },
      ],
    }).compile()

    service = module.get(IngredientsService)
    vi.clearAllMocks()
  })

  describe('findAll', () => {
    it('retourne tous les ingrédients', async () => {
      mockIngredientModel.find.mockReturnValue({ exec: vi.fn().mockResolvedValue(mockIngredients) })

      const result = await service.findAll()

      expect(mockIngredientModel.find).toHaveBeenCalled()
      expect(result).toEqual(mockIngredients)
    })
  })
})
