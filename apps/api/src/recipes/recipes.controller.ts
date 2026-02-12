import { createRecipeDtoSchema } from '@cook-me/schemas'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
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
  create(@Body() body: unknown) {
    const parsedBody = createRecipeDtoSchema.safeParse(body)
    if (!parsedBody.success) {
      throw new BadRequestException({
        message: 'Invalid payload for POST /recipes',
        errors: parsedBody.error.flatten(),
      })
    }

    return this.recipesService.create(parsedBody.data)
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
