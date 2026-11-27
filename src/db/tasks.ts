import { db } from '@/db/db'
import type { UserInput } from '@/logic/validation'
import type { Task } from '@/types/task'

const now = () => new Date().toISOString()

export async function createTask(input: UserInput): Promise<Task> {
  const task: Task = {
    ...input,
    uuid: crypto.randomUUID(),
    lastUpdated: now(),
    tombstone: false,
  }
  await db.tasks.add(task)
  return task
}

export async function listTasks(): Promise<Task[]> {
  return db.tasks.filter((task) => !task.tombstone).toArray()
}

export async function listAllTasksIncludingDeleted(): Promise<Task[]> {
  return db.tasks.toArray()
}

export async function getTask(uuid: string): Promise<Task | undefined> {
  const task = await db.tasks.get(uuid)
  return task && !task.tombstone ? task : undefined
}

export async function updateTask(
  uuid: string,
  changes: Partial<UserInput>,
): Promise<Task | undefined> {
  return db.transaction('rw', db.tasks, async () => {
    const existing = await db.tasks.get(uuid)
    if (!existing || existing.tombstone) return undefined

    const updated: Task = { ...existing, ...changes, lastUpdated: now() }
    await db.tasks.put(updated)
    return updated
  })
}

export async function toggleComplete(uuid: string): Promise<Task | undefined> {
  const existing = await getTask(uuid)
  if (!existing) return undefined
  return updateTask(uuid, { isCompleted: !existing.isCompleted })
}

export async function deleteTask(uuid: string): Promise<boolean> {
  return db.transaction('rw', db.tasks, async () => {
    const existing = await db.tasks.get(uuid)
    if (!existing || existing.tombstone) return false

    await db.tasks.put({ ...existing, tombstone: true, lastUpdated: now() })
    return true
  })
}
