<script setup lang="ts">
import { onMounted } from 'vue'
import { useDockerStore } from '@/modules/docker/store'
import type {
  Container,
  ContainerAction,
  ContainerStatus,
} from '@/modules/docker/api'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseBadge from '@/shared/ui/BaseBadge.vue'

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

const store = useDockerStore()
onMounted(store.load)

const allowedActions: Record<ContainerStatus, ContainerAction[]> = {
  running: ['pause', 'restart', 'stop'],
  paused: ['start', 'restart', 'stop'],
  restarting: [],
  exited: ['start'],
  created: ['start'],
  dead: [],
}

const statusVariant: Record<ContainerStatus, BadgeVariant> = {
  running: 'success',
  paused: 'warning',
  restarting: 'info',
  exited: 'danger',
  created: 'neutral',
  dead: 'danger',
}

const actionLabel: Record<ContainerAction, string> = {
  start: 'Запуск',
  pause: 'Пауза',
  restart: 'Рестарт',
  stop: 'Стоп',
}

const actionsOrder: ContainerAction[] = ['start', 'pause', 'restart', 'stop']

function can(c: Container, action: ContainerAction): boolean {
  return allowedActions[c.status].includes(action)
}

function formatPorts(ports: Container['ports']): string {
  if (ports.length === 0) return '—'
  return ports
    .map((p) => `${p.host ? `${p.host}:` : ''}${p.container}/${p.protocol}`)
    .join(', ')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString()
}
</script>

<template>
  <section class="docker">
    <header class="docker__header">
      <h1>Docker</h1>
      <BaseButton :disabled="store.loading" @click="store.load">Обновить</BaseButton>
    </header>

    <p v-if="store.loading">Загрузка…</p>
    <p v-else-if="store.error" class="docker__error">{{ store.error }}</p>
    <table v-else class="docker__table">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Образ</th>
          <th>Статус</th>
          <th>Порты</th>
          <th>Создан</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in store.items" :key="c.id">
          <td>{{ c.name }}</td>
          <td>{{ c.image }}</td>
          <td>
            <BaseBadge :variant="statusVariant[c.status]">{{ c.status }}</BaseBadge>
          </td>
          <td>{{ formatPorts(c.ports) }}</td>
          <td>{{ formatDate(c.createdAt) }}</td>
          <td class="docker__actions">
            <BaseButton
              v-for="action in actionsOrder"
              :key="action"
              size="sm"
              :variant="action === 'stop' ? 'danger' : 'secondary'"
              :disabled="!can(c, action) || store.acting === c.id"
              @click="store.act(c.id, action)"
            >
              {{ actionLabel[action] }}
            </BaseButton>
          </td>
        </tr>
        <tr v-if="store.items.length === 0">
          <td colspan="6">Нет контейнеров</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style lang="scss" scoped>
.docker {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &__error {
    color: #c00;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--border);
      text-align: left;
    }
  }

  &__actions {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }
}
</style>
