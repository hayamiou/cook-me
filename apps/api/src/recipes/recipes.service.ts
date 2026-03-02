import { ClientProxy } from '@cook-me/ms-utils'
import { CreateRecipeDto } from '@cook-me/schemas'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RecipesRepository } from './recipes.repository'
import { Recipe } from './schemas/recipe.schema'

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
    @Inject('BROKER_SERVICE') private brokerClient: ClientProxy,
    private readonly recipesRepository: RecipesRepository,
  ) {}

  //Création d'une recette
  async create(data: CreateRecipeDto) {
    const recipe = await this.recipeModel.create(data)

    //émission au broker
    this.brokerClient.emit('RecipeCreated', recipe).subscribe({
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

  /**
   * Met à jour uniquement la clé de l'image d'une recette
   */
  async updateImageKey(id: string, imageKey: string): Promise<Recipe> {
    const updatedRecipe = await this.recipeModel.findByIdAndUpdate(
      id,
      { $set: { imageKey: imageKey } }, // On utilise $set pour être explicite
      { new: true, runValidators: true }, // new: true renvoie le doc mis à jour
    )

    if (!updatedRecipe) {
      throw new NotFoundException(`La recette avec l'ID ${id} n'existe pas.`)
    }

    console.log(`[DB] Image mise à jour pour la recette ${id}`)
    return updatedRecipe
  }
}
