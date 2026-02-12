import { type CreateRecipeDto } from '@cook-me/schemas'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Types } from 'mongoose'
import { RecipeEntity } from './entities/recipe.entity'
import { RecipesRepository } from './recipes.repository'
import { type RecipeDocument } from './schemas/recipe.schema'

@Injectable()
export class RecipesService {
  constructor(
    @Inject('BROKER_SERVICE') private client: ClientProxy,
    private readonly recipesRepository: RecipesRepository,
  ) {}

  getHello(): string {
    return 'Hello World!'
  }

  async create(data: CreateRecipeDto): Promise<RecipeEntity> {
    const recipe = await this.recipesRepository.create(data)

    this.client.emit('RecipeCreated', recipe).subscribe({
      complete: () => console.log('Event published: order.created'),
      error: err => console.error('Error publishing event:', err),
    })

    return this.toEntity(recipe)
  }

  async findAll(): Promise<RecipeEntity[]> {
    const recipes = await this.recipesRepository.findAll()
    return recipes.map(recipe => this.toEntity(recipe))
  }

  async getAllRecipes(): Promise<RecipeEntity[]> {
    const recipes = await this.recipesRepository.findAllWithIngredients()
    return recipes.map(recipe => this.toEntity(recipe))
  }

  private toEntity(recipe: RecipeDocument): RecipeEntity {
    return {
      id: String(recipe._id),
      name: recipe.name,
      idCreator: recipe.idCreator,
      ...(recipe.etapes ? { etapes: recipe.etapes } : {}),
      ...(recipe.createdAt ? { createdAt: recipe.createdAt } : {}),
      ...(recipe.updatedAt ? { updatedAt: recipe.updatedAt } : {}),
      ingredients: recipe.ingredients.map(item => ({
        ingredient:
          item.ingredient instanceof Types.ObjectId
            ? item.ingredient.toHexString()
            : String(item.ingredient._id),
        quantity: item.quantity,
      })),
    }
  }
}
