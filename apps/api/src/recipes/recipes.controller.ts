import { CreateRecipeDto, createRecipeDtoSchema } from '@cook-me/schemas'
import { Body, Controller, Get, InternalServerErrorException, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { RecipesService } from './recipes.service'
import { Recipe } from './schemas/recipe.schema'

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}
  @Get('hello')
  getHello(): string {
    return this.recipesService.getHello()
  }

  @Post()
  create(@Body(new ZodValidationPipe(createRecipeDtoSchema)) body: CreateRecipeDto) {
    return this.recipesService.create(body)
  }

  @Get()
  async getRecipes(): Promise<Recipe[]> {
    try {
      return await this.recipesService.getAllRecipes()
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la récupération des recettes')
    }
  }
}
