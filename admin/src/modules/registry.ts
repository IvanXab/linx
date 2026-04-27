import type { AppModule } from './types'
import { servicesModule } from './services'

export const modules: AppModule[] = [
  servicesModule,
  // processesModule,
  // usersModule,
  // packagesModule,
  // logsModule,
]
