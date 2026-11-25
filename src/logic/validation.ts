import type { Task } from '@/types/task'

export type UserInput = Omit<Task, 'uuid' | 'lastUpdated' | 'tombstone'>

export interface ValidationError {
  field: keyof UserInput
  message: string
}

export function validateTask(input: UserInput): ValidationError[] {
  const errors: ValidationError[] = []

  const title = input.title.trim()

  if (title === '') {
    errors.push({
      field: 'title',
      message: 'Title cannot be empty.',
    })
  }

  if (title.length > 100) {
    errors.push({
      field: 'title',
      message: 'Title cannot exceed 100 characters.',
    })
  }

  return errors
}
