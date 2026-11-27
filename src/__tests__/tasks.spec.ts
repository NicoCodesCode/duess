import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/db/db'
import {
  createTask,
  deleteTask,
  getTask,
  listAllTasksIncludingDeleted,
  listTasks,
  toggleComplete,
  updateTask,
} from '@/db/tasks'
import type { UserInput } from '@/logic/validation'

const input: UserInput = {
  subject: 'Chemistry',
  title: 'Homework 1',
  dueDate: '2026-11-25',
  type: 'homework',
  isCompleted: false,
}

beforeEach(async () => {
  await db.tasks.clear()
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-27T10:00:00.000Z'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('createTask', () => {
  it('generates a uuid, sets tombstone false and stamps lastUpdated', async () => {
    const task = await createTask(input)
    expect(task.uuid).toMatch(/^[0-9a-f-]{36}$/)
    expect(task.tombstone).toBe(false)
    expect(task.lastUpdated).toBe('2026-11-27T10:00:00.000Z')
  })

  it('persists the task', async () => {
    const task = await createTask(input)
    expect(await db.tasks.get(task.uuid)).toEqual(task)
  })

  it('generates a different uuid each time', async () => {
    const a = await createTask(input)
    const b = await createTask(input)
    expect(a.uuid).not.toBe(b.uuid)
  })
})

describe('listTasks', () => {
  it('excludes deleted tasks', async () => {
    const keep = await createTask(input)
    const gone = await createTask(input)
    await deleteTask(gone.uuid)
    expect(await listTasks()).toEqual([keep])
  })
})

describe('listAllTasksIncludingDeleted', () => {
  it('includes tombstoned tasks', async () => {
    const task = await createTask(input)
    await deleteTask(task.uuid)
    expect(await listAllTasksIncludingDeleted()).toHaveLength(1)
  })
})

describe('getTask', () => {
  it('returns undefined for a missing or deleted task', async () => {
    expect(await getTask('nope')).toBeUndefined()
    const task = await createTask(input)
    await deleteTask(task.uuid)
    expect(await getTask(task.uuid)).toBeUndefined()
  })
})

describe('updateTask', () => {
  it('applies changes and bumps lastUpdated', async () => {
    const task = await createTask(input)
    vi.setSystemTime(new Date('2026-11-28T10:00:00.000Z'))
    const updated = await updateTask(task.uuid, { title: 'Homework 2' })
    expect(updated?.title).toBe('Homework 2')
    expect(updated?.subject).toBe('Chemistry')
    expect(updated?.lastUpdated).toBe('2026-11-28T10:00:00.000Z')
  })

  it('returns undefined for a missing or deleted task', async () => {
    expect(await updateTask('nope', { title: 'x' })).toBeUndefined()
    const task = await createTask(input)
    await deleteTask(task.uuid)
    expect(await updateTask(task.uuid, { title: 'x' })).toBeUndefined()
  })
})

describe('toggleComplete', () => {
  it('flips isCompleted both ways and bumps lastUpdated', async () => {
    const task = await createTask(input)
    vi.setSystemTime(new Date('2026-11-28T10:00:00.000Z'))
    expect((await toggleComplete(task.uuid))?.isCompleted).toBe(true)
    const again = await toggleComplete(task.uuid)
    expect(again?.isCompleted).toBe(false)
    expect(again?.lastUpdated).toBe('2026-11-28T10:00:00.000Z')
  })
})

describe('deleteTask', () => {
  it('sets tombstone and bumps lastUpdated without removing the row', async () => {
    const task = await createTask(input)
    vi.setSystemTime(new Date('2026-11-28T10:00:00.000Z'))
    expect(await deleteTask(task.uuid)).toBe(true)
    const row = await db.tasks.get(task.uuid)
    expect(row?.tombstone).toBe(true)
    expect(row?.lastUpdated).toBe('2026-11-28T10:00:00.000Z')
  })

  it('returns false for a missing or already deleted task', async () => {
    expect(await deleteTask('nope')).toBe(false)
    const task = await createTask(input)
    await deleteTask(task.uuid)
    expect(await deleteTask(task.uuid)).toBe(false)
  })
})
