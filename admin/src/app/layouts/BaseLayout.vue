<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { modules } from '@/modules/registry'

const navItems = modules.flatMap((m) => m.nav ?? [])
</script>

<template>
  <div class="base-layout">
    <header class="base-layout__header">
      <div class="base-layout__brand">linx</div>
    </header>
    <aside class="base-layout__aside">
      <nav class="base-layout__nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="base-layout__nav-link"
        >
          {{ item.title }}
        </RouterLink>
      </nav>
    </aside>
    <main class="base-layout__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.base-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 56px 1fr;
  grid-template-areas:
    'header header'
    'aside main';
  min-height: 100vh;

  &__header {
    grid-area: header;
    display: flex;
    align-items: center;
    padding: 0 1.25rem;
    border-bottom: 1px solid var(--color-border, #2a2a2a);
  }

  &__brand {
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  &__aside {
    grid-area: aside;
    border-right: 1px solid var(--color-border, #2a2a2a);
    padding: 1rem 0.5rem;
    overflow-y: auto;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__nav-link {
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    color: inherit;
    text-decoration: none;

    &:hover {
      background: var(--color-hover, rgba(255, 255, 255, 0.06));
    }

    &.router-link-active {
      background: var(--color-active, rgba(255, 255, 255, 0.12));
    }
  }

  &__main {
    grid-area: main;
    padding: 1.25rem;
    overflow-y: auto;
  }
}
</style>
