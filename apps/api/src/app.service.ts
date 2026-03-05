import { getHelloWorld } from '@cook-me/shared-utils'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'

@Injectable()
export class AppService {
  static HEALTHCHECK_TIMEOUT_MS = 5000

  constructor(@InjectConnection() readonly connection: Connection) {}

  getState() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      message: getHelloWorld(),
    } as const
  }

  async healthcheck() {
    const timestamp = new Date().toISOString()

    try {
      const db = this.connection.db

      if (!db) {
        throw new Error('MongoDB connection is not ready')
      }

      await Promise.race([
        db.admin().ping(),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('MongoDB ping timeout'))
          }, AppService.HEALTHCHECK_TIMEOUT_MS)
        }),
      ])

      return {
        status: 'ok',
        mongodb: 'up',
        timestamp,
      } as const
    } catch (error) {
      return {
        status: 'error',
        mongodb: 'down',
        reason: error instanceof Error ? error.message : 'Unknown error',
        timestamp,
      } as const
    }
  }
}
