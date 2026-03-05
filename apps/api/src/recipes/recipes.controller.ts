import { EventPattern, EventPayload } from '@cook-me/ms-utils'
import { CreateRecipeDto, RecipeEntityDto } from '@cook-me/schemas'
import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common'
import { Ctx, NatsContext, Payload } from '@nestjs/microservices'
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator'
import { RecipesService } from './recipes.service'
import { CategoryEnum, Recipe } from './schemas/recipe.schema'

@ApiBearerAuth('JWT-auth')
@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  //Réception d'un message du broker : image correctement générée, insertion en base.
  @EventPattern('PatchDocument')
  async onPatchDocument(
    @Payload() data: EventPayload<'PatchDocument'>,
    @Ctx() context: NatsContext,
  ) {
    console.log(`Patch du document : ${context.getSubject()}`, data)
    return this.recipesService.updateImageKey(data.callbackPayload.id, data.imageKey)
  }

  //Création d'une recette
  @Post()
  @ApiResponse({
    type: RecipeEntityDto,
  })
  create(@Body() body: CreateRecipeDto, @CurrentUser() user: CurrentUserData) {
    console.log('User creating recipe:', user.userId)
    return this.recipesService.create(body)
  }

  @Get()
  async getRecipes(@CurrentUser() user: CurrentUserData): Promise<Recipe[]> {
    try {
      console.log('User fetching recipes:', user.userId)
      return await this.recipesService.getAllRecipes()
    } catch (_error) {
      throw new InternalServerErrorException('Erreur lors de la récupération des recettes')
    }
  }

  @Get('category/:category')
  @ApiParam({
    name: 'category',
    enum: CategoryEnum,
    description: 'Catégorie de recette à filtrer',
  })
  async getRecipesByCategory(
    @Param('category') category: string,
    @CurrentUser() user: CurrentUserData,
  ): Promise<Recipe[]> {
    try {
      console.log('User fetching recipes by category:', user.userId, category)
      return await this.recipesService.getRecipesByCategory(category)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des recettes par catégorie',
      )
    }
  }
}
