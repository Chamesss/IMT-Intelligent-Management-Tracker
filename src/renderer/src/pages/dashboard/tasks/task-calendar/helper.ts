import { Task } from 'gantt-task-react'

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter((t) => t.project === projectId)
  let start = projectTasks[0].start
  let end = projectTasks[0].end

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i]
    if (start.getTime() > task.start.getTime()) {
      start = task.start
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end
    }
  }

  start = getMidDayStart(start)
  end = getMidDayEnd(end)

  return [start, end]
}

export function calculateDonePercentage(tasks: task[]): number {
  const totalTasks = tasks.length - 1
  const doneTasks = tasks.reduce((count: number, t: task) => {
    return t.status === 'done' ? count + 1 : count
  }, 0)

  // Calculate the precise percentage without rounding errors
  const donePercentage = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0

  console.log('donePercentage', donePercentage) // Should print 16.666... for 1/6
  return donePercentage
}

export const colorCombinations = [
  { progressColor: '#3b82f6', progressSelectedColor: '#3b82f6A9', status: 'inreview' }, // pink
  { progressColor: '#fbbf24', progressSelectedColor: '#fbbf24A9', status: 'inprogress' }, // light blue
  { progressColor: '#f87171', progressSelectedColor: '#f87171A9', status: 'blocked' }, // red
  { progressColor: '#4ade80', progressSelectedColor: '#4ade80A9', status: 'done' }, // light green
  { progressColor: '#a3a3a3', progressSelectedColor: '#a3a3a3A9', status: 'tobedone' } // lavender
]

export const getMidDayStart = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0)
}

export const getMidDayEnd = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0)
}

export const SortGanttChart = (tasks: Task[]) => {
  const tasksToSort = tasks as unknown as task[]
  // Define the status priority order
  const statusPriority = ['done', 'inreview', 'inprogress', 'tobedone', 'blocked']

  const sortedTasks = tasksToSort.sort((a: task, b: task) => {
    // 1. Sort by startDate
    const startDateA = new Date(a.startDate).getTime()
    const startDateB = new Date(b.startDate).getTime()
    const startDateComparison = startDateA - startDateB
    if (startDateComparison !== 0) return startDateComparison

    // 2. Sort by status priority if startDate is the same
    const statusPriorityA = statusPriority.indexOf(a.status.toLowerCase())
    const statusPriorityB = statusPriority.indexOf(b.status.toLowerCase())
    const statusComparison = statusPriorityA - statusPriorityB
    if (statusComparison !== 0) return statusComparison

    // 3. Sort by createdDate if startDate and status are the same
    const createdDateA = new Date(a.createdAt).getTime()
    const createdDateB = new Date(b.createdAt).getTime()
    const createdDateComparison = createdDateA - createdDateB
    if (createdDateComparison !== 0) return createdDateComparison

    // 4. Sort by duration (deadline - startDate) in descending order if startDate, status, and createdDate are the same
    const durationA = new Date(a.deadline).getTime() - startDateA
    const durationB = new Date(b.deadline).getTime() - startDateB
    return durationB - durationA // Descending order by duration
  })

  return tasks as unknown as Task[]
}
