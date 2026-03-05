import { InternalServerErrorException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RecipesController } from './recipes.controller'
import { RecipesService } from './recipes.service'

const mockUser = { userId: 'user-123', email: 'test@test.com', username: 'testuser', roles: [] }

const mockRecipesService = {
  create: vi.fn(),
  getAllRecipes: vi.fn(),
  updateImageKey: vi.fn(),
}

describe('RecipesController', () => {
  let controller: RecipesController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [{ provide: RecipesService, useValue: mockRecipesService }],
    }).compile()

    controller = module.get(RecipesController)
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('crée une recette avec les données du body', async () => {
      const dto = {
        name: 'Tarte',
        idCreator: 'user-123',
        category: 'dessert',
        ingredients: [],
        steps: [],
      }
      const created = { _id: '1', ...dto }
      mockRecipesService.create.mockResolvedValue(created)

      const result = await controller.create(dto as any, mockUser)

      expect(mockRecipesService.create).toHaveBeenCalledWith(dto)
      expect(result).toEqual(created)
    })
  })

  describe('getRecipes', () => {
    it('retourne la liste des recettes', async () => {
      const recipes = [{ _id: '1', name: 'Tarte' }]
      mockRecipesService.getAllRecipes.mockResolvedValue(recipes)

      const result = await controller.getRecipes(mockUser)

      expect(result).toEqual(recipes)
    })

    it('lève InternalServerErrorException si le service échoue', async () => {
      mockRecipesService.getAllRecipes.mockRejectedValue(new Error('DB error'))

      await expect(controller.getRecipes(mockUser)).rejects.toThrow(InternalServerErrorException)
    })
  })
})
