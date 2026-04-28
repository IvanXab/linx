<script setup lang="ts">
type Variant = 'neutral' | 'success' | 'warning' | 'danger' | 'info'
type Size = 'sm' | 'md'

interface Props {
  variant?: Variant
  size?: Size
}

withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'sm',
})
</script>

<template>
  <span :class="['base-badge', `base-badge--${variant}`, `base-badge--${size}`]">
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.02em;
  border-radius: 999px;
  background: var(--color-hover);
  color: var(--text-h);
  white-space: nowrap;

  &--sm {
    font-size: 12px;
    padding: 2px 8px;
  }

  &--md {
    font-size: 13px;
    padding: 4px 10px;
  }

  &--neutral {
    background: var(--color-hover);
  }

  &--success {
    background: rgba(34, 197, 94, 0.18);
    color: #137a3a;
  }

  &--warning {
    background: rgba(234, 179, 8, 0.22);
    color: #8a6300;
  }

  &--danger {
    background: rgba(239, 68, 68, 0.2);
    color: #a8261c;
  }

  &--info {
    background: rgba(59, 130, 246, 0.18);
    color: #1d4ed8;
  }
}

@media (prefers-color-scheme: dark) {
  .base-badge {
    &--success {
      color: #6ee7a3;
    }

    &--warning {
      color: #fcd34d;
    }

    &--danger {
      color: #fca5a5;
    }

    &--info {
      color: #93c5fd;
    }
  }
}
</style>
