import type { AppModule } from '@/modules/types'
import { servicesModule } from '@/modules/services'
import { dockerModule } from '@/modules/docker'

export const modules: AppModule[] = [
  servicesModule,
  dockerModule,
]
