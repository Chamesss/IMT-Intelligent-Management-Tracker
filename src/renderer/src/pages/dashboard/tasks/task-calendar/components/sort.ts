import { Task } from "../task-calendar"

export const SortGanttChart = (tasks: Task[]) => {
  // Define the status priority order
  const statusPriority = ['done', 'inreview', 'inprogress', 'tobedone', 'blocked']

  const sortedTasks = tasks.sort((a: Task, b: Task) => {
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

  return sortedTasks
}
