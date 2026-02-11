import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { AppProcessor } from './app.processor'

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
  providers: [AppProcessor],
})
export class AppModule {}
