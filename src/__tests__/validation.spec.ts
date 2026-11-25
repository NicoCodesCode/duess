import { describe, expect, it } from 'vitest'
import { validateTask } from '@/logic/validation'

describe('task', () => {
  it('with empty title returns a single error for the field "title"', () => {
    expect(
      validateTask({
        subject: 'Math',
        title: '',
        dueDate: '2026-11-25',
        type: 'homework',
        isCompleted: false,
      }),
    ).toEqual([
      {
        field: 'title',
        message: 'Title cannot be empty.',
      },
    ])
  })

  it('with title "Homework 1" returns an empty array', () => {
    expect(
      validateTask({
        subject: 'Math',
        title: 'Homework 1',
        dueDate: '2026-11-25',
        type: 'homework',
        isCompleted: false,
      }),
    ).toEqual([])
  })

  it('with title "Chemistry lab report" returns an empty array', () => {
    expect(
      validateTask({
        subject: 'Math',
        title: 'Chemistry lab report',
        dueDate: '2026-11-25',
        type: 'homework',
        isCompleted: false,
      }),
    ).toEqual([])
  })
})
