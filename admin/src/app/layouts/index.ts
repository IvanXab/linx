import type { Component } from 'vue'
import BaseLayout from '@/app/layouts/BaseLayout.vue'

export const layouts = {
  base: BaseLayout,
} satisfies Record<string, Component>

export type LayoutName = keyof typeof layouts

export const DEFAULT_LAYOUT: LayoutName = 'base'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: LayoutName
  }
}
