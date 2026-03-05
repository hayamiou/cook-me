import { S3Client } from '@aws-sdk/client-s3'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MongooseModule } from '@nestjs/mongoose'
import { RecipesController } from './recipes.controller'
import { RecipesRepository } from './recipes.repository'
import { RecipesService } from './recipes.service'
import { Ingredient, IngredientSchema, Recipe, RecipeSchema } from './schemas/recipe.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recipe.name, schema: RecipeSchema },
      { name: Ingredient.name, schema: IngredientSchema },
    ]),
    ClientsModule.register([
      {
        name: 'BROKER_SERVICE',
        transport: Transport.NATS,
        options: { servers: ['nats://nats:4222'] },
      },
    ]),
  ],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    RecipesRepository,
    {
      provide: 'S3_CLIENT',
      useFactory: () =>
        new S3Client({
          endpoint: `http://${process.env['MINIO_ENDPOINT'] ?? 'minio'}:9000`,
          region: 'us-east-1',
          credentials: {
            accessKeyId: process.env['MINIO_USER'] ?? 'minio',
            secretAccessKey: process.env['MINIO_PASSWORD'] ?? 'minioSecret',
          },
          forcePathStyle: true,
        }),
    },
  ],
  exports: [RecipesService, RecipesRepository],
})
export class RecipesModule {}
