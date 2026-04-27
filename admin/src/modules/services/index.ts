import type { AppModule } from '../types'
import { routes } from './routes'

export const servicesModule: AppModule = {
  id: 'services',
  title: 'Сервисы',
  routes,
  nav: [{ to: '/services', title: 'Сервисы' }],
}
