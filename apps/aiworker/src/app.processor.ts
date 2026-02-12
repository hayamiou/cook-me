import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Job } from 'bullmq'

@Processor('aiQueue')
export class AppProcessor extends WorkerHost {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy, // Pour renvoyer l'URL
  ) {
    super()
  }

  // Appelé quand le worker se connecte à Redis
  @OnWorkerEvent('ready')
  onReady() {
    console.log('✅ AIWorker est connecté à Redis et prêt')
  }

  // Appelé si la connexion échoue
  @OnWorkerEvent('error')
  onError(err: Error) {
    console.error('❌ Erreur de connexion Redis sur le Worker :', err)
  }

  async process(job: Job<any>): Promise<any> {
    console.log('--- NOUVEAU JOB DÉTECTÉ SUR LE WORKER AIWORKER ---')
    console.log('Jobname :', job.data.originalData.name)

    // Simulation d'un traitement long (IA, image, etc.)
    await new Promise(res => setTimeout(res, 3000))

    console.log('--- TRAITEMENT TERMINÉ ---')
    console.log('Job terminé :', job.data.originalData.name)
    return { status: 'processed_by_worker_b' }
  }
}
