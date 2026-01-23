import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/CMDB'),
    RecipesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

