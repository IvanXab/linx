import type { App } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/app/router'

export function registerProviders(app: App) {
  app.use(createPinia())
  app.use(router)
}