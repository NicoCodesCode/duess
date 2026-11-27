import type { Task } from '@/types/task'

const collator = new Intl.Collator(undefined, { sensitivity: 'accent' })

const compareText = (a: string, b: string) => collator.compare(a, b)

export function sortByDueDate(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate) || compareText(a.title, b.title),
  )
}

export function sortBySubject(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => compareText(a.subject, b.subject))
}

export function sortByTitle(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => compareText(a.title, b.title))
}

export function filterByCompleted(tasks: Task[], completed: boolean): Task[] {
  return tasks.filter((task) => task.isCompleted === completed)
}

export function filterBySubject(tasks: Task[], subject: string): Task[] {
  return tasks.filter((task) => compareText(task.subject, subject) === 0)
}

export function isOverdue(task: Task, today: string): boolean {
  return !task.isCompleted && task.dueDate < today
}

export function getLocalToday(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export interface SubjectGroup {
  subject: string
  tasks: Task[]
}

export function groupBySubject(tasks: Task[]): SubjectGroup[] {
  const groups: SubjectGroup[] = []

  for (const task of tasks) {
    const group = groups.find((g) => compareText(g.subject, task.subject) === 0)
    if (group) group.tasks.push(task)
    else groups.push({ subject: task.subject, tasks: [task] })
  }

  return groups.sort((a, b) => compareText(a.subject, b.subject))
}
