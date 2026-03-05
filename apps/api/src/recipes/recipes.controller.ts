import { EventPattern, EventPayload } from '@cook-me/ms-utils'
import { CreateRecipeDto, RecipeEntityDto } from '@cook-me/schemas'
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Res,
} from '@nestjs/common'
import { Ctx, NatsContext, Payload } from '@nestjs/microservices'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import axios from 'axios'
import { Response } from 'express'
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

  @Get('storage/:bucket/:filename') // Le chemin sera donc /recipes/storage/...
  async getFile(
    @Param('bucket') bucket: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const minioUrl = `http://minio:9000/${bucket}/${filename}`
    try {
      const response = await axios({
        method: 'GET',
        url: minioUrl,
        responseType: 'stream',
      })
      res.setHeader('Content-Type', response.headers['content-type'])
      response.data.pipe(res)
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('Image non trouvée')
    }
  }
}
