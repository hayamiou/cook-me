import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IngredientsController } from './ingredients.controller'
import { IngredientsService } from './ingredients.service'

const mockIngredients = [
  { _id: '1', title: 'Farine', unit: 'grammes' },
  { _id: '2', title: 'Lait', unit: 'litres' },
]

const mockIngredientsService = {
  findAll: vi.fn(),
}

describe('IngredientsController', () => {
  let controller: IngredientsController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [IngredientsController],
      providers: [{ provide: IngredientsService, useValue: mockIngredientsService }],
    }).compile()

    controller = module.get(IngredientsController)
    vi.clearAllMocks()
  })

  describe('findAll', () => {
    it('retourne la liste des ingrédients', async () => {
      mockIngredientsService.findAll.mockResolvedValue(mockIngredients)

      const result = await controller.findAll()

      expect(mockIngredientsService.findAll).toHaveBeenCalled()
      expect(result).toEqual(mockIngredients)
    })
  })
})
