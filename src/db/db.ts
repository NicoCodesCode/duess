import type { Task } from '@/types/task'
import { Dexie, type EntityTable } from 'dexie'

export const db = new Dexie('duessDatabase') as Dexie & {
  tasks: EntityTable<Task, 'uuid'>
}

db.version(1).stores({
  tasks: 'uuid, dueDate',
})
