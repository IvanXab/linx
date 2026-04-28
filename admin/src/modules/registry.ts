import type { AppModule } from '@/modules/types'
import { dockerModule } from '@/modules/docker'

export const modules: AppModule[] = [
  dockerModule,
]
