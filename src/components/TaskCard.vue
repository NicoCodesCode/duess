<script setup lang="ts">
import type { Task } from '@/types/task'

defineProps<{ task: Task; overdue: boolean }>()
defineEmits<{ toggle: []; edit: []; delete: [] }>()

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

const label = (type: string) => type.charAt(0).toUpperCase() + type.slice(1)
</script>

<template>
  <article class="card" :class="{ done: task.isCompleted, overdue }">
    <button
      class="check"
      :aria-label="task.isCompleted ? 'Mark as not done' : 'Mark as done'"
      :aria-pressed="task.isCompleted"
      @click="$emit('toggle')"
    >
      <span v-if="task.isCompleted">✓</span>
    </button>

    <button class="body" @click="$emit('edit')">
      <span class="title">{{ task.title }}</span>
      <span class="meta">
        {{ task.subject }} · {{ label(task.type) }} ·
        <span class="date">{{ overdue ? 'Overdue · ' : '' }}{{ formatDate(task.dueDate) }}</span>
      </span>
    </button>

    <button class="delete" aria-label="Delete task" @click="$emit('delete')">🗑</button>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left-width: 4px;
  border-radius: 12px;
  padding: 4px;
}
.card.overdue {
  border-left-color: var(--danger);
}
.check {
  flex: none;
  width: 44px;
  height: 44px;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
}
.check::before {
  content: '';
  position: absolute;
}
.check span,
.check {
  font-weight: 700;
  color: var(--accent-text);
}
.check {
  position: relative;
}
.check::after {
  content: '';
  position: absolute;
  inset: 10px;
  border: 2px solid var(--muted);
  border-radius: 50%;
  z-index: 0;
}
.card.done .check::after {
  background: var(--accent);
  border-color: var(--accent);
}
.check span {
  position: relative;
  z-index: 1;
}
.body {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 2px;
  text-align: left;
  border: 0;
  background: transparent;
  padding: 8px 4px;
}
.title {
  font-weight: 600;
  overflow-wrap: anywhere;
}
.meta {
  font-size: 0.85rem;
  color: var(--muted);
}
.overdue .date {
  color: var(--danger);
  font-weight: 600;
}
.done .title {
  text-decoration: line-through;
  color: var(--muted);
}
.delete {
  flex: none;
  width: 44px;
  height: 44px;
  border: 0;
  background: transparent;
  opacity: 0.6;
}
</style>
