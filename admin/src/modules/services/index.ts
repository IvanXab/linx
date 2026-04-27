import type { AppModule } from '@/modules/types'
import { routes } from '@/modules/services/routes'

export const servicesModule: AppModule = {
  id: 'services',
  title: 'Сервисы',
  routes,
  nav: [{ to: '/services', title: 'Сервисы' }],
}
