import type { RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'

export interface NavItem {
  to: string
  title: string
  icon?: Component
}

export interface AppModule {
  id: string
  title: string
  routes: RouteRecordRaw[]
  nav?: NavItem[]
}
