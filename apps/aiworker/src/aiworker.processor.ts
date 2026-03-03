import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { ClientProxy, EventPayload } from '@cook-me/ms-utils'
import { AIGeneratedEventNames } from '@cook-me/ms-utils/events'
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject } from '@nestjs/common'
import axios from 'axios'
import { Job } from 'bullmq'
import { firstValueFrom } from 'rxjs'

@Processor('aiQueue')
export class AiworkerProcessor extends WorkerHost {
  constructor(
    @Inject('BROKER_SERVICE') private brokerClient: ClientProxy,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
  ) {
    super()
  }

  // Appelé quand le worker se connecte à Redis (prêt à récupérer les evènements en queue)
  @OnWorkerEvent('ready')
  onReady() {
    console.log('✅ AIWorker est connecté à Redis et prêt')
  }

  // Appelé si la connexion échoue
  @OnWorkerEvent('error')
  onError(err: Error) {
    console.error('❌ Erreur de connexion Redis sur le Worker :', err)
  }

  async process<T extends AIGeneratedEventNames>(
    job: Job<{
      prompt: string
      callbackEvent: { name: T; payload: EventPayload<T> }
    }>,
  ): Promise<any> {
    const { name } = job
    const { prompt, callbackEvent } = job.data

    console.log('--- NOUVEAU JOB DÉTECTÉ SUR LE WORKER AIWORKER ---')
    console.log('Job ID :', name)
    console.log('Prompt : ', prompt)

    //traitement : envoi du prompt à l'API pollinations
    const bucketName = process.env['MINIO_BUCKET']
    const fileName = `${name}.png`

    try {
      const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?model=flux&width=512&height=512`

      // RÉCUPÉRATION DE L'IMAGE (Buffer)
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${process.env['POLLINATIONS_API_KEY']}`,
          Accept: 'image/*',
        },
      })
      const buffer = Buffer.from(response.data, 'binary')

      // ENVOI VERS MINIO
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: buffer,
          ContentType: 'image/png',
        }),
      )

      console.log(`[Worker] Image stockée : ${name}.png`)

      // ENVOI AU BROKER (NATS)
      await firstValueFrom(
        this.brokerClient.emit<AIGeneratedEventNames>(callbackEvent.name, {
          callbackPayload: callbackEvent.payload,
          imageKey: fileName,
        }),
      )

      return { success: true, key: fileName }
    } catch (error) {
      console.error('Échec du workflow IA:', error)
      throw error
    }
  }
}
