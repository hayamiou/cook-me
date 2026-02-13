import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { EnricherController } from './enricher.controller'
import { EnricherService } from './enricher.service'

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
  controllers: [EnricherController],
  providers: [EnricherService],
})
export class EnricherModule {}
