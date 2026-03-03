import 'reflect-metadata'

// biome-ignore lint/suspicious/noExplicitAny: to allow hmr
declare const module: any

import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  const port = Number(process.env['PORT'] ?? 3001)

  //Configuration microservice (NATS)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: ['nats://nats:4222'],
    },
  })
  await app.startAllMicroservices()

  // ---------------- Swagger ----------------
  const config = new DocumentBuilder()
    .setTitle('Cook Me API')
    .setDescription("Documentation de l'API Cook Me")
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document) // Swagger sera accessible sur /api

  await app.listen(port)
  console.log(`🚀 Application running on: http://localhost:${port}/api`)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

void bootstrap()
