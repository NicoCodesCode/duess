import { describe, expect, it } from 'vitest'
import { validateTask, type UserInput } from '@/logic/validation'

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

describe('task', () => {
  // title tests
  it('with valid input returns an empty array', () => {
    expect(validateTask(makeInput())).toEqual([])
  })

  it('with empty title returns a single error for the field "title"', () => {
    expect(validateTask(makeInput({ title: '' }))).toEqual([
      {
        field: 'title',
        message: 'Title cannot be empty.',
      },
    ])
  })

  it('with whitespace title returns a single error for the field "title"', () => {
    expect(validateTask(makeInput({ title: '   ' }))).toEqual([
      {
        field: 'title',
        message: 'Title cannot be empty.',
      },
    ])
  })

  it('with a 100 character title returns an empty array', () => {
    expect(validateTask(makeInput({ title: 'A'.repeat(100) }))).toEqual([])
  })

  it('with a 101 character title returns an error for the field "title"', () => {
    expect(validateTask(makeInput({ title: 'A'.repeat(101) }))).toEqual([
      {
        field: 'title',
        message: 'Title cannot exceed 100 characters.',
      },
    ])
  })

  // subject tests
  it('with empty subject returns a single error for the field "subject"', () => {
    expect(validateTask(makeInput({ subject: '' }))).toEqual([
      {
        field: 'subject',
        message: 'Subject cannot be empty.',
      },
    ])
  })

  it('with whitespace subject returns a single error for the field "subject"', () => {
    expect(validateTask(makeInput({ subject: '   ' }))).toEqual([
      {
        field: 'subject',
        message: 'Subject cannot be empty.',
      },
    ])
  })

  it('with a 100 character subject returns an empty array', () => {
    expect(validateTask(makeInput({ subject: 'A'.repeat(100) }))).toEqual([])
  })

  it('with a 101 character subject returns an error for the field "subject"', () => {
    expect(validateTask(makeInput({ subject: 'A'.repeat(101) }))).toEqual([
      {
        field: 'subject',
        message: 'Subject cannot exceed 100 characters.',
      },
    ])
  })
})
