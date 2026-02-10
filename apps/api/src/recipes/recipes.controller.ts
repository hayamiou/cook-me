import { Body, Controller, Get, Post } from '@nestjs/common'
import { RecipesService } from './recipes.service'

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}
  @Get('hello')
  getHello(): string {
    return this.recipesService.getHello()
  }
  @Post()
  create(@Body() body: any) {
    return this.recipesService.create(body)
  }
}
