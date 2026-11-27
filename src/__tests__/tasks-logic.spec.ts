import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  filterByCompleted,
  filterBySubject,
  getLocalToday,
  groupBySubject,
  isOverdue,
  sortByDueDate,
  sortBySubject,
  sortByTitle,
} from '@/logic/tasks'
import type { Task } from '@/types/task'

let counter = 0
function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    uuid: `id-${counter++}`,
    subject: 'Chemistry',
    title: 'Homework 1',
    dueDate: '2026-11-25',
    type: 'homework',
    isCompleted: false,
    lastUpdated: '2026-11-20T10:00:00.000Z',
    tombstone: false,
    ...overrides,
  }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('sorting', () => {
  it('sortByDueDate orders earliest first and breaks ties by title', () => {
    const a = makeTask({ dueDate: '2026-12-01', title: 'B' })
    const b = makeTask({ dueDate: '2026-11-01', title: 'Z' })
    const c = makeTask({ dueDate: '2026-11-01', title: 'A' })
    expect(sortByDueDate([a, b, c])).toEqual([c, b, a])
  })

  it('sortBySubject is case-insensitive', () => {
    const a = makeTask({ subject: 'math' })
    const b = makeTask({ subject: 'Biology' })
    expect(sortBySubject([a, b])).toEqual([b, a])
  })

  it('sortByTitle is case-insensitive', () => {
    const a = makeTask({ title: 'zebra' })
    const b = makeTask({ title: 'Apple' })
    expect(sortByTitle([a, b])).toEqual([b, a])
  })

  it('does not mutate the input', () => {
    const tasks = [makeTask({ dueDate: '2026-12-01' }), makeTask({ dueDate: '2026-11-01' })]
    const copy = [...tasks]
    sortByDueDate(tasks)
    sortBySubject(tasks)
    sortByTitle(tasks)
    expect(tasks).toEqual(copy)
  })
})

describe('filtering', () => {
  it('filterByCompleted keeps matching tasks', () => {
    const done = makeTask({ isCompleted: true })
    const open = makeTask({ isCompleted: false })
    expect(filterByCompleted([done, open], true)).toEqual([done])
    expect(filterByCompleted([done, open], false)).toEqual([open])
  })

  it('filterBySubject ignores case', () => {
    const chem = makeTask({ subject: 'Chemistry' })
    const math = makeTask({ subject: 'Math' })
    expect(filterBySubject([chem, math], 'chemistry')).toEqual([chem])
  })
})

describe('isOverdue', () => {
  const today = '2026-11-27'

  it('is false when due today', () => {
    expect(isOverdue(makeTask({ dueDate: today }), today)).toBe(false)
  })

  it('is true when due yesterday', () => {
    expect(isOverdue(makeTask({ dueDate: '2026-11-26' }), today)).toBe(true)
  })

  it('is false for a completed past-due task', () => {
    expect(isOverdue(makeTask({ dueDate: '2026-11-01', isCompleted: true }), today)).toBe(false)
  })

  it('is false for a future task', () => {
    expect(isOverdue(makeTask({ dueDate: '2026-12-01' }), today)).toBe(false)
  })
})

describe('getLocalToday', () => {
  it('uses the local day, padded', () => {
    vi.useFakeTimers()
    // 8pm local time on Jan 5: must be 2027-01-05 whatever the timezone.
    vi.setSystemTime(new Date(2027, 0, 5, 20, 0))
    expect(getLocalToday()).toBe('2027-01-05')
  })
})

describe('groupBySubject', () => {
  it('groups case-insensitively, using the first spelling', () => {
    const a = makeTask({ subject: 'Chemistry' })
    const b = makeTask({ subject: 'chemistry' })
    const c = makeTask({ subject: 'Art' })
    expect(groupBySubject([a, b, c])).toEqual([
      { subject: 'Art', tasks: [c] },
      { subject: 'Chemistry', tasks: [a, b] },
    ])
  })

  it('returns an empty array for no tasks', () => {
    expect(groupBySubject([])).toEqual([])
  })
})
