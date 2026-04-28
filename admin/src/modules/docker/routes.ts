import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/docker',
    name: 'docker',
    component: () => import('./views/DockerView.vue'),
  },
]
