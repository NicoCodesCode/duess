<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getLocalToday } from '@/logic/tasks'
import {
  normalizeInput,
  validateTask,
  type UserInput,
  type ValidationError,
} from '@/logic/validation'
import { TASK_TYPES, type Task } from '@/types/task'

const props = defineProps<{ task?: Task; subjects: string[] }>()
const emit = defineEmits<{ save: [input: UserInput]; cancel: [] }>()

const form = reactive<UserInput>({
  subject: props.task?.subject ?? '',
  title: props.task?.title ?? '',
  dueDate: props.task?.dueDate ?? getLocalToday(),
  type: props.task?.type ?? 'homework',
  isCompleted: props.task?.isCompleted ?? false,
})

const errors = ref<ValidationError[]>([])
const errorFor = (field: keyof UserInput) => errors.value.find((e) => e.field === field)?.message

const label = (type: string) => type.charAt(0).toUpperCase() + type.slice(1)

function submit() {
  const input = normalizeInput({ ...form })
  errors.value = validateTask(input)
  if (errors.value.length === 0) emit('save', input)
}
</script>

<template>
  <div class="backdrop" @click.self="emit('cancel')">
    <form class="sheet" novalidate @submit.prevent="submit">
      <h2>{{ task ? 'Edit task' : 'New task' }}</h2>

      <label>
        Title
        <input v-model="form.title" type="text" placeholder="e.g. Homework ch. 5" autofocus />
        <small v-if="errorFor('title')" class="error">{{ errorFor('title') }}</small>
      </label>

      <label>
        Subject
        <input v-model="form.subject" type="text" list="subjects" placeholder="e.g. Chemistry" />
        <datalist id="subjects">
          <option v-for="s in subjects" :key="s" :value="s" />
        </datalist>
        <small v-if="errorFor('subject')" class="error">{{ errorFor('subject') }}</small>
      </label>

      <div class="row">
        <label>
          Type
          <select v-model="form.type">
            <option v-for="t in TASK_TYPES" :key="t" :value="t">{{ label(t) }}</option>
          </select>
          <small v-if="errorFor('type')" class="error">{{ errorFor('type') }}</small>
        </label>

        <label>
          Due date
          <input v-model="form.dueDate" type="date" />
          <small v-if="errorFor('dueDate')" class="error">{{ errorFor('dueDate') }}</small>
        </label>
      </div>

      <div class="actions">
        <button type="button" class="secondary" @click="emit('cancel')">Cancel</button>
        <button type="submit" class="primary">Save</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 10;
}
.sheet {
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  padding: 20px 16px calc(16px + env(safe-area-inset-bottom));
  display: grid;
  gap: 14px;
}
h2 {
  margin: 0;
  font-size: 1.2rem;
}
label {
  display: grid;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--muted);
}
input,
select {
  width: 100%;
  min-height: 44px;
  padding: 8px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  font-size: 1rem;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.error {
  color: var(--danger);
}
.actions {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}
.actions button {
  flex: 1;
  min-height: 48px;
  border-radius: 12px;
  border: 1px solid var(--border);
  font-weight: 600;
}
.primary {
  background: var(--accent);
  color: var(--accent-text);
  border-color: var(--accent) !important;
}
.secondary {
  background: transparent;
}

@media (min-width: 700px) {
  .backdrop {
    align-items: center;
  }
  .sheet {
    max-width: 480px;
    border-radius: 20px;
    padding-bottom: 20px;
  }
}
</style>
