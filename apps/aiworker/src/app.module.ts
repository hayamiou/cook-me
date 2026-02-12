import { S3Client } from '@aws-sdk/client-s3'
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
  providers: [
    AppProcessor,
    {
      // On définit le client S3 ici
      provide: 'S3_CLIENT',
      useFactory: () => {
        return new S3Client({
          endpoint: 'http://minio:9000', // 'minio' si dans docker-compose, sinon 'localhost'
          region: 'us-east-1',
          credentials: {
            accessKeyId: 'minio',
            secretAccessKey: 'minioSecret',
          },
          forcePathStyle: true, // Crucial pour Minio
        })
      },
    },
  ],
})
export class AppModule {}
