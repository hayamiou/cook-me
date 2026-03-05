import { NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RecipesRepository } from './recipes.repository'
import { RecipesService } from './recipes.service'
import { Recipe } from './schemas/recipe.schema'

const mockRecipe = {
  _id: 'recipe-id-1',
  name: 'Tarte aux pommes',
  idCreator: 'user-123',
  category: 'dessert',
  ingredients: [],
  steps: ['Éplucher les pommes', 'Faire la pâte'],
  imageKey: null,
}

const mockRecipeModel = {
  create: vi.fn(),
  find: vi.fn(),
  findByIdAndUpdate: vi.fn(),
}

const mockBrokerClient = {
  emit: vi.fn(),
}

const mockRecipesRepository = {
  findAllWithIngredients: vi.fn(),
}

describe('RecipesService', () => {
  let service: RecipesService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: getModelToken(Recipe.name), useValue: mockRecipeModel },
        { provide: 'BROKER_SERVICE', useValue: mockBrokerClient },
        { provide: RecipesRepository, useValue: mockRecipesRepository },
      ],
    }).compile()

    service = module.get(RecipesService)
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('crée une recette et émet un événement NATS', async () => {
      mockRecipeModel.create.mockResolvedValue(mockRecipe)
      mockBrokerClient.emit.mockReturnValue({ subscribe: vi.fn() })

      const dto = {
        name: 'Tarte aux pommes',
        idCreator: 'user-123',
        category: 'dessert',
        ingredients: [],
        steps: [],
      }
      const result = await service.create(dto as any)

      expect(mockRecipeModel.create).toHaveBeenCalledWith(dto)
      expect(mockBrokerClient.emit).toHaveBeenCalledWith('RecipeCreated', mockRecipe)
      expect(result).toEqual(mockRecipe)
    })

    it("n'échoue pas si l'émission NATS échoue", async () => {
      mockRecipeModel.create.mockResolvedValue(mockRecipe)
      mockBrokerClient.emit.mockReturnValue({
        subscribe: vi.fn(({ error }) => error(new Error('NATS down'))),
      })

      const dto = {
        name: 'Tarte aux pommes',
        idCreator: 'user-123',
        category: 'dessert',
        ingredients: [],
        steps: [],
      }
      const result = await service.create(dto as any)

      expect(result).toEqual(mockRecipe)
    })
  })

  describe('findAll', () => {
    it('retourne toutes les recettes', async () => {
      const recipes = [mockRecipe]
      mockRecipeModel.find.mockReturnValue({ exec: vi.fn().mockResolvedValue(recipes) })

      const result = await service.findAll()

      expect(mockRecipeModel.find).toHaveBeenCalled()
      expect(result).toEqual(recipes)
    })
  })

  describe('getAllRecipes', () => {
    it('délègue au repository avec populate des ingrédients', async () => {
      const recipes = [mockRecipe]
      mockRecipesRepository.findAllWithIngredients.mockResolvedValue(recipes)

      const result = await service.getAllRecipes()

      expect(mockRecipesRepository.findAllWithIngredients).toHaveBeenCalled()
      expect(result).toEqual(recipes)
    })
  })

  describe('updateImageKey', () => {
    it('met à jour la clé image et retourne la recette mise à jour', async () => {
      const updated = { ...mockRecipe, imageKey: 'images/tarte.jpg' }
      mockRecipeModel.findByIdAndUpdate.mockResolvedValue(updated)

      const result = await service.updateImageKey('recipe-id-1', 'images/tarte.jpg')

      expect(mockRecipeModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'recipe-id-1',
        { $set: { imageKey: 'images/tarte.jpg' } },
        { new: true, runValidators: true },
      )
      expect(result).toEqual(updated)
    })

    it("lève NotFoundException si la recette n'existe pas", async () => {
      mockRecipeModel.findByIdAndUpdate.mockResolvedValue(null)

      await expect(service.updateImageKey('inexistant', 'img.jpg')).rejects.toThrow(
        NotFoundException,
      )
    })
  })
})
