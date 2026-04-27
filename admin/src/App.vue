<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { modules } from './modules/registry'

const navItems = modules.flatMap((m) => m.nav ?? [])
</script>

<template>
  <div class="layout">
    <aside>
      <nav>
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
          {{ item.title }}
        </RouterLink>
      </nav>
    </aside>
    <main>
      <RouterView />
    </main>
  </div>
</template>
