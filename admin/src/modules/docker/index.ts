import type { AppModule } from '@/modules/types'
import { routes } from '@/modules/docker/routes'

export const dockerModule: AppModule = {
  id: 'docker',
  title: 'Docker',
  routes,
  nav: [{ to: '/docker', title: 'Docker' }],
}
