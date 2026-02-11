import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'

@Processor('aiQueue')
export class AppProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<any> {
    console.log('--- NOUVEAU JOB DÉTECTÉ SUR LE WORKER AIWORKER ---')
    console.log('Données du job :', job.data)

    // Simulation d'un traitement long (IA, image, etc.)
    await new Promise(res => setTimeout(res, 3000))

    console.log('--- TRAITEMENT TERMINÉ ---')
    return { status: 'processed_by_worker_b' }
  }
}
