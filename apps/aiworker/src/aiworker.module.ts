import { S3Client } from '@aws-sdk/client-s3'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AiworkerProcessor } from './aiworker.processor'

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
  providers: [
    AiworkerProcessor,
    {
      provide: 'S3_CLIENT',
      useFactory: () => {
        return new S3Client({
          endpoint: 'http://minio:9000',
          region: 'us-east-1',
          credentials: {
            accessKeyId: 'minio',
            secretAccessKey: 'minioSecret',
          },
          forcePathStyle: true,
        })
      },
    },
  ],
})
export class AiworkerModule {}
