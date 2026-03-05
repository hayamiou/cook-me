import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RecipesRepository } from './recipes.repository'
import { Recipe } from './schemas/recipe.schema'

const mockRecipes = [
  {
    _id: '1',
    name: 'Tarte',
    ingredients: [{ ingredient: { _id: 'ing-1', title: 'Farine' }, quantity: 200 }],
  },
  { _id: '2', name: 'Soupe', ingredients: [] },
]

const mockRecipeModel = {
  create: vi.fn(),
  find: vi.fn(),
}

describe('RecipesRepository', () => {
  let repository: RecipesRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RecipesRepository,
        { provide: getModelToken(Recipe.name), useValue: mockRecipeModel },
      ],
    }).compile()

    repository = module.get(RecipesRepository)
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('crée une recette via le modèle', async () => {
      const dto = {
        name: 'Tarte',
        idCreator: 'user-1',
        category: 'dessert',
        ingredients: [],
        steps: [],
      }
      mockRecipeModel.create.mockResolvedValue({ _id: '1', ...dto })

      const result = await repository.create(dto as any)

      expect(mockRecipeModel.create).toHaveBeenCalledWith(dto)
      expect(result).toMatchObject({ name: 'Tarte' })
    })
  })

  describe('findAll', () => {
    it('retourne toutes les recettes sans populate', async () => {
      mockRecipeModel.find.mockReturnValue({ exec: vi.fn().mockResolvedValue(mockRecipes) })

      const result = await repository.findAll()

      expect(mockRecipeModel.find).toHaveBeenCalled()
      expect(result).toHaveLength(2)
    })
  })

  describe('findAllWithIngredients', () => {
    it('retourne les recettes avec les ingrédients populés', async () => {
      mockRecipeModel.find.mockReturnValue({
        populate: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockRecipes),
        }),
      })

      const result = await repository.findAllWithIngredients()

      expect(mockRecipeModel.find).toHaveBeenCalled()
      expect(result).toEqual(mockRecipes)
    })
  })
})
