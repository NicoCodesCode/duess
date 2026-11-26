import { isTaskType, TASK_TYPES, type Task } from '@/types/task'

export type UserInput = Omit<Task, 'uuid' | 'lastUpdated' | 'tombstone'>

export interface ValidationError {
  field: keyof UserInput
  message: string
}

const TEXT_FIELD_MAX_LENGTH = 100

export function validateTask(input: UserInput): ValidationError[] {
  const errors: ValidationError[] = []

  const titleValidationErrors = validateText('title', input.title)
  if (titleValidationErrors) {
    errors.push(titleValidationErrors)
  }

  const subjectValidationErrors = validateText('subject', input.subject)
  if (subjectValidationErrors) {
    errors.push(subjectValidationErrors)
  }

  const dateValidationErrors = validateDate(input.dueDate)
  if (dateValidationErrors) {
    errors.push(dateValidationErrors)
  }

  if (!isTaskType(input.type)) {
    errors.push({
      field: 'type',
      message: `Type must be a valid task type (${TASK_TYPES.join(', ')}).`,
    })
  }

  return errors
}

function validateText(field: 'title' | 'subject', value: string): ValidationError | null {
  const trimmedValue = value.trim()
  const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1)

  if (trimmedValue === '') {
    return {
      field,
      message: `${capitalizedField} cannot be empty.`,
    }
  }

  if (trimmedValue.length > TEXT_FIELD_MAX_LENGTH) {
    return {
      field,
      message: `${capitalizedField} cannot exceed ${TEXT_FIELD_MAX_LENGTH} characters.`,
    }
  }

  return null
}

function validateDate(date: string): ValidationError | null {
  if (date.trim() === '') {
    return {
      field: 'dueDate',
      message: 'Due date cannot be empty.',
    }
  }

  const dueDateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dueDateRegex.test(date)) {
    return {
      field: 'dueDate',
      message: 'Due date must be in the format YYYY-MM-DD.',
    }
  }

  const year = Number(date.slice(0, 4))
  const month = Number(date.slice(5, 7))
  const day = Number(date.slice(8, 10))

  const constructedDate = new Date(year, month - 1, day)

  if (
    constructedDate.getFullYear() !== year ||
    constructedDate.getMonth() + 1 !== month ||
    constructedDate.getDate() !== day
  ) {
    return {
      field: 'dueDate',
      message: 'Due date must be a real calendar date.',
    }
  }

  return null
}
