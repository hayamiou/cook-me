import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { IngredientsService } from './ingredients.service'
import { Ingredient } from './schemas/ingredient.schema'

@ApiBearerAuth('JWT-auth')
@ApiTags('ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  @ApiResponse({ type: [Ingredient] })
  findAll(): Promise<Ingredient[]> {
    return this.ingredientsService.findAll()
  }
}
