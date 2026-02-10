import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'aiQueue',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
