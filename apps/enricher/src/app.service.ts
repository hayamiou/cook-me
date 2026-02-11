import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'

@Injectable()
export class AppService {
  constructor(@InjectQueue('aiQueue') private aiQueue: Queue) {}
  async sendToAiQueue(data: any) {
    //envoi à la queue redis
    await this.aiQueue.add(data._id, {
      originalData: data,
    })
  }
}
