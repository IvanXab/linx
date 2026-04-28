<script setup lang="ts">
import { computed, useSlots } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'
type IconPosition = 'left' | 'right'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: Variant
  size?: Size
  iconPosition?: IconPosition
  disabled?: boolean
  ariaLabel?: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'secondary',
  size: 'md',
  iconPosition: 'left',
  disabled: false,
})

const slots = useSlots()

const isIconOnly = computed(() => !!slots.icon && !slots.default)

const titleAttr = computed(() => props.title ?? props.ariaLabel)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :title="titleAttr"
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      `base-button--icon-${iconPosition}`,
      { 'base-button--icon-only': isIconOnly },
    ]"
  >
    <span v-if="$slots.icon" class="base-button__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span v-if="$slots.default" class="base-button__label">
      <slot />
    </span>
  </button>
</template>

<style lang="scss" scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--bg);
  color: var(--text-h);
  font: inherit;
  line-height: 1;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease,
    color 120ms ease;

  &:hover:not(:disabled) {
    background: var(--color-hover);
  }

  &:active:not(:disabled) {
    background: var(--color-active);
  }

  &:focus-visible {
    outline: 2px solid var(--text-h);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    :deep(svg) {
      width: 1em;
      height: 1em;
      display: block;
    }
  }

  &__label {
    display: inline-block;
  }

  &--icon-right {
    flex-direction: row-reverse;
  }

  &--sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.8125rem;
  }

  &--md {
    padding: 0.4375rem 0.875rem;
    font-size: 0.875rem;
  }

  &--lg {
    padding: 0.625rem 1.125rem;
    font-size: 1rem;
  }

  &--icon-only {
    padding: 0.375rem;
    aspect-ratio: 1 / 1;

    &.base-button--sm {
      padding: 0.25rem;
    }

    &.base-button--lg {
      padding: 0.5rem;
    }
  }

  &--primary {
    background: var(--text-h);
    border-color: var(--text-h);
    color: var(--bg);

    &:hover:not(:disabled) {
      background: var(--text);
      border-color: var(--text);
    }
  }

  &--ghost {
    border-color: transparent;
    background: transparent;
  }

  &--danger {
    color: #c0392b;
    border-color: #c0392b;

    &:hover:not(:disabled) {
      background: rgba(192, 57, 43, 0.1);
    }
  }
}
</style>
