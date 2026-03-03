import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
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
  controllers: [EnricherController],
  providers: [EnricherService],
})
export class EnricherModule {}
