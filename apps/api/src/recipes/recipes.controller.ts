import { CreateRecipeDto, createRecipeDtoSchema, RecipeEntityDto } from '@cook-me/schemas'
import { Body, Controller, Get, InternalServerErrorException, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { ZodResponse } from 'nestjs-zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { RecipeEntity } from './entities/recipe.entity'
import { RecipesService } from './recipes.service'

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}
  @Get('hello')
  getHello(): string {
    return this.recipesService.getHello()
  }

  /* @Post()
  create(@Body() body: unknown): Promise<RecipeEntity> {
    const parsedBody = createRecipeDtoSchema.safeParse(body)
    if (!parsedBody.success) {
      throw new BadRequestException({
        message: 'Invalid payload for POST /recipes',
        errors: parsedBody.error.flatten(),
      })
    }

    return this.recipesService.create(parsedBody.data)
    */
  @Post()
  @ApiResponse({
    type: RecipeEntityDto,
  })
  create(@Body() body: CreateRecipeDto) {
    return this.recipesService.create(body)
  }

  @Get()
  async getRecipes(): Promise<RecipeEntity[]> {
    try {
      return await this.recipesService.getAllRecipes()
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la récupération des recettes')
    }
  }
}
