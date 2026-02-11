import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MongooseModule } from '@nestjs/mongoose'
import { RecipesController } from './recipes.controller'
import { RecipesRepository } from './recipes.repository'
import { RecipesService } from './recipes.service'
import { Ingredient, IngredientSchema, Recipe, RecipeSchema } from './schemas/recipe.schema'

@Module({
  imports: [
    // Indispensable : lie le nom "Recipe" au schéma réel
    MongooseModule.forFeature([
      { name: Recipe.name, schema: RecipeSchema },
      { name: Ingredient.name, schema: IngredientSchema },
    ]),
    ClientsModule.register([
      {
        name: 'BROKER_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://nats:4222'],
        },
      },
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository],
  exports: [RecipesService, RecipesRepository],
})
export class RecipesModule {}
