import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/services',
    name: 'services',
    component: () => import('./views/ServicesView.vue'),
  },
]
