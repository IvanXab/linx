import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { modules } from '../modules/registry'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/services' },
  ...modules.flatMap((m) => m.routes),
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
