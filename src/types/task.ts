export const TASK_TYPES = ['homework', 'exam', 'project', 'other'] as const

export interface Task {
  uuid: string
  subject: string
  title: string
  dueDate: string
  type: (typeof TASK_TYPES)[number]
  isCompleted: boolean
  lastUpdated: string
  tombstone: boolean
}

export type TaskType = Task['type']
export function isTaskType(value: string): value is TaskType {
  return (TASK_TYPES as readonly string[]).includes(value)
}
