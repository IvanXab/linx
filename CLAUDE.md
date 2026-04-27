# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**linx** — fullstack-приложение для управления Linux-сервером.

Архитектура состоит из трёх слоёв + e2e-тесты:

```
/admin   — Vue 3 + TypeScript SPA (админ-панель, npm, Node.js 22.14.0)
/core    — Go-ядро: привилегированный агент, выполняющий операции на хосте
/api     — Node.js REST-прослойка между admin и core
/tests   — e2e-тесты на Playwright
```

Поток запроса: **admin (Vue) → api (Node.js REST) → core (Go) → Linux**.

Проект на ранней стадии — каталоги созданы, но содержимое ещё формируется. Перед работой проверяй фактическое состояние и обновляй этот файл при расхождениях.

## Commands

### admin (`/admin`) — Vue 3 + TS
```bash
npm install
npm run dev        # дев-сервер Vite
npm run build      # production-сборка
npm run lint       # ESLint
npm run typecheck  # vue-tsc
npm test           # Vitest (ожидаемо)
```

### api (`/api`) — Node.js REST
```bash
npm install
npm run dev        # dev-режим с автоперезапуском
npm run build
npm start
npm test
```

### core (`/core`) — Go
```bash
go run ./cmd/server                   # запуск ядра
go build ./...
go test ./...
go test ./path/to/pkg -run TestName   # один тест
go vet ./...
gofmt -w .
```

### tests (`/tests`) — Playwright
```bash
npm install
npx playwright install                          # один раз — браузеры
npx playwright test                             # все e2e
npx playwright test path/to/spec.ts             # один файл
npx playwright test -g "название теста"         # один тест по имени
npx playwright test --ui                        # интерактивный режим
```

> Конкретные имена скриптов и пути (`cmd/server` и т.п.) уточнить при первом коммите соответствующего пакета и обновить этот раздел.

## Architecture notes

- **`core` — единственный слой с привилегиями.** Только Go-ядро взаимодействует с ОС напрямую (systemd, `/proc`, пакеты, сеть, пользователи, exec). Системные вызовы изолируются за интерфейсами для возможности мокать в тестах. Внутри: транспорт → сервисы → системные адаптеры.
- **`api` — тонкий REST-шлюз.** Аутентификация, авторизация, валидация входа, агрегация ответов, проксирование к `core`. Никакой бизнес-логики управления сервером в Node.js — она вся в `core`.
- **`admin` — тонкий клиент.** Vue только вызывает `api` и рендерит состояние. Никакой логики управления сервером на фронте — это упрощает аудит безопасности.
- **Стриминг.** Длительные операции (логи, top-подобные метрики, вывод команд) — через WebSocket/SSE, а не polling. Решить, где терминируется сокет — в `api` или напрямую в `core`.
- **Граница доверия = `api → core`.** Авторизация и валидация на уровне `api`; `core` дополнительно валидирует контракт, но не доверяет вызывающему.

## Conventions

- TypeScript (`admin`, `api`, `tests`): `strict: true`, `any` запрещён без явного комментария-обоснования.
- Vue 3: Composition API + `<script setup>`.
- Go: стандартный layout (`cmd/`, `internal/`); ошибки оборачиваются `fmt.Errorf("...: %w", err)`.
- Команды на хосте: только `exec.Command(name, args...)` с явными аргументами — никакой конкатенации строк с пользовательским вводом, никакого `sh -c`.
- e2e-тесты в `/tests` гоняются против полного стека (`admin` + `api` + `core`), не против моков.
