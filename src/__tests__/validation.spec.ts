import { describe, expect, it } from 'vitest'
import { validateTask, type UserInput } from '@/logic/validation'
import { TASK_TYPES } from '@/types/task'

const MALFORMED_DATES = ['friday', '2026-1-5', 'abc2026-11-25', '2026-11-25abc', ' 2026-11-25 ']
const INEXISTENT_DATES = ['2026-02-31', '2026-02-29', '2026-13-01', '2026-00-10', '2026-04-31']

function makeInput(overrides?: Partial<UserInput>): UserInput {
  const input: UserInput = {
    subject: 'Chemistry',
    title: 'Homework 1',
    dueDate: '2026-11-25',
    type: 'homework',
    isCompleted: false,
  }

  return { ...input, ...overrides }
}

describe('validateTask', () => {
  it('valid input returns an empty array', () => {
    expect(validateTask(makeInput())).toEqual([])
  })

  describe('title', () => {
    it('is empty and returns a single error for the field "title"', () => {
      expect(validateTask(makeInput({ title: '' }))).toEqual([
        {
          field: 'title',
          message: 'Title cannot be empty.',
        },
      ])
    })

    it('is whitespace-only and returns a single error for the field "title"', () => {
      expect(validateTask(makeInput({ title: '   ' }))).toEqual([
        {
          field: 'title',
          message: 'Title cannot be empty.',
        },
      ])
    })

    it('is within the maximum length and returns an empty array', () => {
      expect(validateTask(makeInput({ title: 'A'.repeat(100) }))).toEqual([])
    })

    it('exceeds the maximum length and returns an error for the field "title"', () => {
      expect(validateTask(makeInput({ title: 'A'.repeat(101) }))).toEqual([
        {
          field: 'title',
          message: 'Title cannot exceed 100 characters.',
        },
      ])
    })
  })

  describe('subject', () => {
    it('is empty and returns a single error for the field "subject"', () => {
      expect(validateTask(makeInput({ subject: '' }))).toEqual([
        {
          field: 'subject',
          message: 'Subject cannot be empty.',
        },
      ])
    })

    it('is whitespace-only and returns a single error for the field "subject"', () => {
      expect(validateTask(makeInput({ subject: '   ' }))).toEqual([
        {
          field: 'subject',
          message: 'Subject cannot be empty.',
        },
      ])
    })

    it('is within the maximum length and returns an empty array', () => {
      expect(validateTask(makeInput({ subject: 'A'.repeat(100) }))).toEqual([])
    })

    it('exceeds the maximum length and returns an error for the field "subject"', () => {
      expect(validateTask(makeInput({ subject: 'A'.repeat(101) }))).toEqual([
        {
          field: 'subject',
          message: 'Subject cannot exceed 100 characters.',
        },
      ])
    })
  })

  describe('type', () => {
    it('is invalid and returns a single error for the field "type"', () => {
      expect(validateTask(makeInput({ type: 'banana' as UserInput['type'] }))).toEqual([
        {
          field: 'type',
          message: `Type must be a valid task type (${TASK_TYPES.join(', ')}).`,
        },
      ])
    })

    it.each(TASK_TYPES)('is valid type "%s" and returns an empty array', (type) => {
      expect(validateTask(makeInput({ type }))).toEqual([])
    })
  })

  describe('dueDate', () => {
    it('is empty and returns a single error for the field "dueDate"', () => {
      expect(validateTask(makeInput({ dueDate: '' }))).toEqual([
        {
          field: 'dueDate',
          message: 'Due date cannot be empty.',
        },
      ])
    })

    it.each(MALFORMED_DATES)(
      'has the wrong format "%s" and returns a single error for the field "dueDate"',
      (date) => {
        expect(validateTask(makeInput({ dueDate: date }))).toEqual([
          {
            field: 'dueDate',
            message: 'Due date must be in the format YYYY-MM-DD.',
          },
        ])
      },
    )

    it.each(INEXISTENT_DATES)(
      'does not exist (%s) and returns a single error for the field "dueDate"',
      (date) => {
        expect(validateTask(makeInput({ dueDate: date }))).toEqual([
          {
            field: 'dueDate',
            message: 'Due date must be a real calendar date.',
          },
        ])
      },
    )

    it('is "2028-02-29" and returns an empty array', () => {
      expect(validateTask(makeInput({ dueDate: '2028-02-29' }))).toEqual([])
    })
  })
})
