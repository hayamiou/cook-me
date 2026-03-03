import { EventPattern, EventPayload } from '@cook-me/ms-utils'
import { CreateRecipeDto, RecipeEntityDto } from '@cook-me/schemas'
import { Body, Controller, Get, InternalServerErrorException, Post } from '@nestjs/common'
import { Ctx, NatsContext, Payload } from '@nestjs/microservices'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { RecipesService } from './recipes.service'
import { Recipe } from './schemas/recipe.schema'

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
  create(@Body() body: CreateRecipeDto) {
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
