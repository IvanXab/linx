import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { modules } from '@/modules/registry'
import { layouts, DEFAULT_LAYOUT, type LayoutName } from '@/app/layouts'

const moduleRoutes = modules.flatMap((m) => m.routes)

const grouped = new Map<LayoutName, RouteRecordRaw[]>()

for (const route of moduleRoutes) {
  const layout = route.meta?.layout ?? DEFAULT_LAYOUT
  if (!grouped.has(layout)) grouped.set(layout, [])
  grouped.get(layout)!.push(route)
}

const layoutRoutes: RouteRecordRaw[] = Array.from(grouped, ([name, children]) => ({
  path: '/',
  component: layouts[name],
  children,
}))

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/services' },
  ...layoutRoutes,
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})