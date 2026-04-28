---
name: create-module
description: Создание нового модуля в admin-панели (Vue 3 + TS + Pinia). Содержит полные шаблоны файлов модуля.
---

# Skill: Создание модуля

## Когда использовать
Когда пользователь просит создать новый модуль в frontend админке (`/admin`).

## Архитектурный контекст

- Стек: Vue 3 (`<script setup>`, Composition API), TypeScript `strict: true`, Pinia (setup-style), vue-router, Vite. Алиас `@` → `admin/src`.
- Каждый модуль — самостоятельная папка в `admin/src/modules/<id>/`, экспортирующая объект `AppModule`.
- Модули подключаются ровно в одном месте — `admin/src/modules/registry.ts` через явный импорт.
- Admin — тонкий клиент: бизнес-логики управления сервером во фронте нет, только вызов `api` и рендеринг состояния.

## Контракт модуля

Файл `admin/src/modules/types.ts` (общий для всех модулей):

```ts
import type { RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'

export interface NavItem {
  to: string
  title: string
  icon?: Component
}

export interface AppModule {
  id: string                  // машинное имя, kebab-case, совпадает с папкой
  title: string               // человекочитаемое имя (RU)
  routes: RouteRecordRaw[]    // маршруты vue-router
  nav?: NavItem[]             // пункты бокового меню (опционально)
}
```

Если `types.ts` или `registry.ts` отсутствуют — создать их.

Шаблон `admin/src/modules/registry.ts`:

```ts
import type { AppModule } from '@/modules/types'
import { exampleModule } from '@/modules/example'

export const modules: AppModule[] = [
  exampleModule,
]
```

## Структура папки модуля

```
admin/src/modules/<id>/
  index.ts                # экспорт <id>Module: AppModule
  routes.ts               # RouteRecordRaw[] — все роуты модуля
  api.ts                  # DTO-интерфейсы + объект <id>Api поверх @/shared/api/client
  store.ts                # Pinia store (setup-style), defineStore id == id модуля
  views/
    <Pascal>View.vue      # одна страница на роут
```

По мере необходимости: `components/`, `composables/`, `types.ts`. Пустых папок «на будущее» не создавать.

## Шаблоны файлов

Подставь `<id>` (kebab-case), `<Id>` (PascalCase), `<idCamel>` (camelCase), `<Title>` (RU).

### `index.ts`

```ts
import type { AppModule } from '@/modules/types'
import { routes } from '@/modules/<id>/routes'

export const <idCamel>Module: AppModule = {
  id: '<id>',
  title: '<Title>',
  routes,
  nav: [{ to: '/<id>', title: '<Title>' }],
}
```

### `routes.ts`

```ts
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/<id>',
    name: '<id>',
    component: () => import('./views/<Id>View.vue'),
  },
]
```

Правила: `path` начинается со `/<id>` (kebab-case), `name` равен `id` для корневого роута и `<id>-<sub>` для подроутов, `component` лениво грузится через относительный `./views/...`.

### `api.ts`

```ts
import { api } from '@/shared/api/client'

export interface <Id>Item {
  // поля DTO
}

export const <idCamel>Api = {
  list: () => api.get<<Id>Item[]>('/<id>'),
  get: (id: string) => api.get<<Id>Item>(`/<id>/${encodeURIComponent(id)}`),
  // мутации:
  // create: (payload: ...) => api.post<<Id>Item>('/<id>', payload),
  // update: (id: string, payload: ...) => api.put<<Id>Item>(`/<id>/${encodeURIComponent(id)}`, payload),
  // remove: (id: string) => api.delete<void>(`/<id>/${encodeURIComponent(id)}`),
}
```

Правила: только тонкий слой над HTTP, без бизнес-логики. Любой динамический сегмент пути оборачивать в `encodeURIComponent`. Конкатенация с пользовательским вводом без экранирования запрещена. DTO-интерфейсы экспортировать именованно.

### `store.ts`

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { <idCamel>Api, type <Id>Item } from '@/modules/<id>/api'

export const use<Id>Store = defineStore('<id>', () => {
  const items = ref<<Id>Item[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      items.value = await <idCamel>Api.list()
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  // Мутирующие действия после успеха перезагружают список:
  // async function remove(id: string) {
  //   await <idCamel>Api.remove(id)
  //   await load()
  // }

  return { items, loading, error, load }
})
```

Правила: Pinia setup-style, id стора совпадает с id модуля, базовый state `items / loading / error: string | null`. Ошибки приводятся к строке через `e instanceof Error ? e.message : String(e)`. Импорты внутри модуля — через алиас `@/modules/<id>/...`, не относительные.

### `views/<Id>View.vue`

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { use<Id>Store } from '@/modules/<id>/store'

const store = use<Id>Store()
onMounted(store.load)
</script>

<template>
  <section>
    <h1><Title></h1>
    <p v-if="store.loading">Загрузка…</p>
    <p v-else-if="store.error" class="error">{{ store.error }}</p>
    <div v-else>
      <!-- рендер store.items -->
    </div>
  </section>
</template>
```

Правила: `<script setup lang="ts">`, Composition API. Загрузка через `onMounted(store.load)`. Состояния `loading / error / данные` через `v-if / v-else-if / v-else`. Прямых вызовов `api.ts` из компонента нет — только через store.

## Шаги создания нового модуля

1. Согласовать с пользователем: `id` (kebab-case), `title` (RU), список роутов, REST-эндпоинты бэкенда, форма DTO.
2. Создать папку `admin/src/modules/<id>/` и файлы `index.ts`, `routes.ts`, `api.ts`, `store.ts`, `views/<Id>View.vue` по шаблонам выше.
3. Зарегистрировать модуль в `admin/src/modules/registry.ts`: импорт `<idCamel>Module` и добавление его в массив `modules`.
4. Из каталога `/admin`: `npm run typecheck` и `npm run lint`. Ошибки — починить.

## Чего не делать

- Не вызывать `api.ts` напрямую из компонентов — только через store.
- Не размещать бизнес-логику управления сервером во фронте — admin тонкий клиент.
- Не использовать Options API в Vue/Pinia — только setup-style.
- Не использовать `any` без явного комментария-обоснования (`strict: true`).
- Не конкатенировать пользовательский ввод в URL — только `encodeURIComponent`.
- Не создавать barrel-файлы `index.ts` на каждом уровне — только корневой `index.ts` модуля.
- Не подключать модуль через автозагрузку/globs — только явный импорт в `registry.ts`.
- Не создавать пустых заготовок (`components/`, `composables/`) до появления реального кода.
