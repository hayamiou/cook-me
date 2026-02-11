import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { AppModule } from '../src/app.module'
import { AppService } from '../src/app.service'

describe('API e2e', () => {
  let app: INestApplication
  const timestamp = new Date().toISOString()

  const appService = {
    getState: () => ({
      status: 'ok',
      message: 'Test',
      timestamp,
      uptime: 0,
    }),
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(appService)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /state returns ok + Hello World', async () => {
    return request(app.getHttpServer()).get('/state').expect(200).expect(appService.getState())
  })
})
