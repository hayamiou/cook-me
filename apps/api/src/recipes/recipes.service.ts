import { ClientProxy } from '@cook-me/ms-utils'
import { CreateRecipeDto } from '@cook-me/schemas'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RecipesRepository } from './recipes.repository'
import { CategoryEnum, Recipe } from './schemas/recipe.schema'

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
    @Inject('BROKER_SERVICE') private brokerClient: ClientProxy,
    private readonly recipesRepository: RecipesRepository,
  ) {}

  //Création d'une recette
  async create(data: CreateRecipeDto, userId: string) {
    const dataToCreate: CreateRecipeDto = {
      ...data,
      idCreator: userId,
    }

    const recipe = await this.recipeModel.create(dataToCreate)

    //émission au broker
    this.brokerClient.emit('RecipeCreated', recipe).subscribe({
      complete: () => console.log('Event published: RecipeCreated'),
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

  getRecipesByCreator(userId: string) {
    return this.recipesRepository.findByCreator(userId)
  }

  async getRecipesByCategory(category: string) {
    if (!Object.values(CategoryEnum).includes(category as CategoryEnum)) {
      throw new BadRequestException(
        `Catégorie invalide. Valeurs autorisées: ${Object.values(CategoryEnum).join(', ')}`,
      )
    }

    return this.recipesRepository.findByCategory(category as CategoryEnum)
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
