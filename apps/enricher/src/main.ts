import 'reflect-metadata'

// biome-ignore lint/suspicious/noExplicitAny: to allow hmr
declare const module: any

import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { EnricherModule } from './enricher.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EnricherModule, {
    transport: Transport.NATS,
    options: {
      servers: ['nats://nats:4222'],
    },
  })

  await app.listen()

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

void bootstrap()
