import { type CreateRecipeDto } from '@cook-me/schemas'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RecipesRepository } from './recipes.repository'
import { Recipe } from './recipes.schema'

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
    @Inject('BROKER_SERVICE') private client: ClientProxy,
    private readonly recipesRepository: RecipesRepository,
  ) {}

  getHello(): string {
    return 'Hello World!'
  }

  async create(data: CreateRecipeDto) {
    const recipe = await this.recipeModel.create(data)

    this.client.emit('RecipeCreated', recipe).subscribe({
      complete: () => console.log('Event published: order.created'),
      error: err => console.error('Error publishing event:', err),
    })

    return recipe
  }

  async findAll() {
    return this.recipeModel.find().exec()
  }

  getAllRecipes() {
    return this.recipesRepository.findAllWithIngredients()
  }
}
