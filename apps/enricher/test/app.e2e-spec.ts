import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { EnricherModule } from '../src/enricher.module'
import { EnricherService } from '../src/enricher.service'

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
      imports: [EnricherModule],
    })
      .overrideProvider(EnricherService)
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
