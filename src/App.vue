<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskForm from '@/components/TaskForm.vue'
import { createTask, deleteTask, listTasks, toggleComplete, updateTask } from '@/db/tasks'
import {
  filterByCompleted,
  getLocalToday,
  groupBySubject,
  isOverdue,
  sortByDueDate,
} from '@/logic/tasks'
import type { UserInput } from '@/logic/validation'
import type { Task } from '@/types/task'

const tasks = ref<Task[]>([])
const today = ref(getLocalToday())
const view = ref<'date' | 'subject'>('date')
const showCompleted = ref(false)
const editing = ref<Task | 'new' | null>(null)

async function load() {
  today.value = getLocalToday()
  tasks.value = await listTasks()
}

onMounted(load)

const sorted = computed(() => {
  const visible = showCompleted.value ? tasks.value : filterByCompleted(tasks.value, false)
  return sortByDueDate(visible)
})
const groups = computed(() => groupBySubject(sorted.value))
const subjects = computed(() => [...new Set(tasks.value.map((t) => t.subject))])
const hiddenCount = computed(() => tasks.value.length - sorted.value.length)

async function onSave(input: UserInput) {
  if (editing.value && editing.value !== 'new') {
    await updateTask(editing.value.uuid, input)
  } else {
    await createTask(input)
  }
  editing.value = null
  await load()
}

async function onToggle(task: Task) {
  await toggleComplete(task.uuid)
  await load()
}

async function onDelete(task: Task) {
  if (!confirm(`Delete "${task.title}"?`)) return
  await deleteTask(task.uuid)
  await load()
}
</script>

<template>
  <main class="app">
    <header class="top">
      <h1>Duess</h1>
      <div class="segmented" role="tablist" aria-label="View">
        <button :class="{ on: view === 'date' }" @click="view = 'date'">By date</button>
        <button :class="{ on: view === 'subject' }" @click="view = 'subject'">By subject</button>
      </div>
      <label class="toggle">
        <input v-model="showCompleted" type="checkbox" />
        Show completed
      </label>
    </header>

    <p v-if="tasks.length === 0" class="empty">
      Nothing due. Tap <strong>+</strong> to add your first task.
    </p>
    <p v-else-if="sorted.length === 0" class="empty">
      All done! {{ hiddenCount }} completed task{{ hiddenCount === 1 ? '' : 's' }} hidden.
    </p>

    <ul v-else-if="view === 'date'" class="list">
      <li v-for="task in sorted" :key="task.uuid">
        <TaskCard
          :task="task"
          :overdue="isOverdue(task, today)"
          @toggle="onToggle(task)"
          @edit="editing = task"
          @delete="onDelete(task)"
        />
      </li>
    </ul>

    <template v-else>
      <section v-for="group in groups" :key="group.subject" class="group">
        <h2>{{ group.subject }}</h2>
        <ul class="list">
          <li v-for="task in group.tasks" :key="task.uuid">
            <TaskCard
              :task="task"
              :overdue="isOverdue(task, today)"
              @toggle="onToggle(task)"
              @edit="editing = task"
              @delete="onDelete(task)"
            />
          </li>
        </ul>
      </section>
    </template>

    <button class="fab" aria-label="Add task" @click="editing = 'new'">+</button>

    <Teleport to="body">
      <TaskForm
        v-if="editing"
        :task="editing === 'new' ? undefined : editing"
        :subjects="subjects"
        @save="onSave"
        @cancel="editing = null"
      />
    </Teleport>
  </main>
</template>

<style scoped>
.app {
  max-width: 640px;
  margin: 0 auto;
  padding: 16px 16px 96px;
}
.top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
h1 {
  margin: 0;
  font-size: 1.5rem;
  flex: 1;
}
.segmented {
  display: flex;
  background: var(--border);
  border-radius: 10px;
  padding: 3px;
}
.segmented button {
  border: 0;
  background: transparent;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--muted);
}
.segmented button.on {
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
}
.toggle {
  flex-basis: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 0.9rem;
}
.toggle input {
  width: 18px;
  height: 18px;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
.group {
  margin-bottom: 20px;
}
.group h2 {
  margin: 0 0 8px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
}
.empty {
  text-align: center;
  color: var(--muted);
  margin-top: 64px;
}
.fab {
  position: fixed;
  right: 20px;
  bottom: calc(20px + env(safe-area-inset-bottom));
  width: 56px;
  height: 56px;
  border: 0;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-text);
  font-size: 2rem;
  line-height: 1;
  box-shadow: 0 4px 14px rgb(0 0 0 / 0.25);
}
</style>
