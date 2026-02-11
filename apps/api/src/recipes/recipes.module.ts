import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MongooseModule } from '@nestjs/mongoose'
import { RecipesController } from './recipes.controller'
import { Recipe, RecipeSchema } from './recipes.schema'
import { RecipesService } from './recipes.service'

@Module({
  imports: [
    // Indispensable : lie le nom "Recipe" au schéma réel
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
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
  providers: [RecipesService],
  controllers: [RecipesController],
})
export class RecipesModule {}
