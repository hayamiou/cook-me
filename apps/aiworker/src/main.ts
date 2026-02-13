import 'reflect-metadata'

// biome-ignore lint/suspicious/noExplicitAny: to allow hmr
declare const module: any

import { NestFactory } from '@nestjs/core'
import { AiworkerModule } from './aiworker.module'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AiworkerModule)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

void bootstrap()
