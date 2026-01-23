import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { IngredientsModule } from './ingredients/ingredients.module'
import { RecipesModule } from './recipes/recipes.module'

@Module({
  imports: [MongooseModule.forRoot('mongodb://mongo:27017/CMDB'), RecipesModule, IngredientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
