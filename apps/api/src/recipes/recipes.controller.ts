import { EventPattern, EventPayload } from '@cook-me/ms-utils'
import { CreateRecipeDto, RecipeEntityDto } from '@cook-me/schemas'
import { Body, Controller, Get, InternalServerErrorException, Logger, Post } from '@nestjs/common'
import { Ctx, NatsContext, Payload } from '@nestjs/microservices'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator'
import { RecipesService } from './recipes.service'
import { Recipe } from './schemas/recipe.schema'

@ApiBearerAuth('JWT-auth')
@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  private readonly logger = new Logger(RecipesController.name)

  constructor(private readonly recipesService: RecipesService) {}

  //Réception d'un message du broker : image correctement générée, insertion en base.
  @EventPattern('PatchDocument')
  async onPatchDocument(
    @Payload() data: EventPayload<'PatchDocument'>,
    @Ctx() context: NatsContext,
  ) {
    this.logger.debug(`Patch du document : ${context.getSubject()}`)
    return this.recipesService.updateImageKey(data.callbackPayload.id, data.imageKey)
  }

  //Création d'une recette
  @Post()
  @ApiResponse({
    type: RecipeEntityDto,
  })
  create(@Body() body: CreateRecipeDto, @CurrentUser() user: CurrentUserData) {
    this.logger.debug(`User creating recipe: ${user.userId}`)
    return this.recipesService.create(body)
  }

  @Get()
  async getRecipes(@CurrentUser() user: CurrentUserData): Promise<Recipe[]> {
    try {
      this.logger.debug(`User fetching recipes: ${user.userId}`)
      return await this.recipesService.getAllRecipes()
    } catch (_error) {
      throw new InternalServerErrorException('Erreur lors de la récupération des recettes')
    }
  }
}
