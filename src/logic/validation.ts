import { isTaskType, TASK_TYPES, type Task } from '@/types/task'

export type UserInput = Omit<Task, 'uuid' | 'lastUpdated' | 'tombstone'>

export interface ValidationError {
  field: keyof UserInput
  message: string
}

const TEXT_FIELD_MAX_LENGTH = 100

export function validateTask(input: UserInput): ValidationError[] {
  const errors: ValidationError[] = []

  errors.push(...validateText('title', input.title), ...validateText('subject', input.subject))

  if (!isTaskType(input.type)) {
    errors.push({
      field: 'type',
      message: `Type must be a valid task type (${TASK_TYPES.join(', ')}).`,
    })
  }

  return errors
}

function validateText(field: 'title' | 'subject', value: string): ValidationError[] {
  const errors: ValidationError[] = []

  const trimmedValue = value.trim()
  const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1)

  if (trimmedValue === '') {
    errors.push({
      field,
      message: `${capitalizedField} cannot be empty.`,
    })
  }

  if (trimmedValue.length > TEXT_FIELD_MAX_LENGTH) {
    errors.push({
      field,
      message: `${capitalizedField} cannot exceed ${TEXT_FIELD_MAX_LENGTH} characters.`,
    })
  }

  return errors
}
