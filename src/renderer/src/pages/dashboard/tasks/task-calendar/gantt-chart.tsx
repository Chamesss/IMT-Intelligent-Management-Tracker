import EmptyFolder from '@/assets/misc/empty'
import Spinner from '@/components/spinner'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { useSocket } from '@/hooks/useSocket'
import { Card, CardContent, CardFooter } from '@/ui/card'
import { Gantt, Task, ViewMode } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import TaskListHeader from './gantt-components/task-list-header'
import TaskListTable from './gantt-components/task-list-table'
import TaskTooltip from './gantt-components/task-tooltip'
import { ViewSwitcher } from './gantt-components/view-switcher'
import {
  calculateDonePercentage,
  colorCombinations,
  getMidDayEnd,
  getMidDayStart,
  getStartEndDateForProject,
  SortGanttChart
} from './helper'

export default function GanttChart() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [view, setView] = useState<ViewMode>(ViewMode.Day)
  const [height, setHeight] = useState(0)
  const [showTaskList, setShowTaskList] = useState(true)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const api = useAxiosInterceptors()
  const projectId = location.state.projectId
  const projectName = location.state.projectName
  const subContentRef = useRef<HTMLDivElement>(null)
  const socket = useSocket()

  let columnWidth = 65
  if (view === ViewMode.Month) {
    columnWidth = 300
  } else if (view === ViewMode.Week) {
    columnWidth = 250
  }

  const calculateGanttHeight = () =>
    subContentRef.current && setHeight(subContentRef.current?.clientHeight - 65)

  useEffect(() => {
    calculateGanttHeight()
    window.addEventListener('resize', calculateGanttHeight)

    return () => {
      window.removeEventListener('resize', calculateGanttHeight)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const response = await api.get(`/api/task/tasks/${projectId}`)
        if (response.data.length === 0) return
        const tasks = response.data.tasks.map((task: task) => {
          let colors = colorCombinations.find((color) => color.status === task.status.toLowerCase())
          if (!colors) {
            colors = colorCombinations[4]
          }
          const startDate = new Date(task.startDate) || new Date()
          let endDate = new Date(task.deadline) || new Date()

          // check if the startDate is greater than endDate
          if (startDate >= endDate) endDate = new Date(startDate.getTime() + 3600 * 1000)

          let start = getMidDayStart(startDate)
          let end = getMidDayEnd(endDate)

          return {
            ...task,
            id: task._id,
            start: start,
            end: end,
            type: 'task',
            isDisabled: true,
            project: projectId,
            progress: 100,
            styles: {
              progressColor: colors.progressSelectedColor,
              progressSelectedColor: colors.progressSelectedColor
            }
          }
        })

        const minStartDate = new Date(Math.min(...tasks.map((t: Task) => t.start.getTime())))
        const maxEndDate = new Date(Math.max(...tasks.map((t: Task) => t.end.getTime())))
        const donePercentage = calculateDonePercentage([...tasks, []] as unknown as task[])
        const orderedTasks = [
          {
            start: minStartDate,
            end: maxEndDate,
            name: projectName,
            id: projectId,
            type: 'project',
            isDisabled: true,
            hideChildren: false,
            progress: donePercentage,
            displayOrder: 1
          },
          ...SortGanttChart(tasks).map((task, index, sortedTasks) => ({
            ...task,
            dependencies: index > 0 ? [sortedTasks[index - 1].id] : [],
            displayOrder: index + 2
          }))
        ]

        // @ts-ignore
        setTasks(orderedTasks)
      } catch (error) {
        console.log(error)
        toast.error('Error fetching tasks')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    socket.on('taskCreate', (data: task) => {
      projectId === data.projectId &&
        setTasks((prevTasks) => {
          const startDate = new Date(data.startDate) || new Date()
          const endDate = new Date(data.deadline) || new Date()
          let colors = colorCombinations.find((color) => color.status === data.status.toLowerCase())
          if (!colors) {
            colors = colorCombinations[4]
          }
          let start = getMidDayStart(startDate)
          let end = getMidDayEnd(endDate)
          const tasks = [
            ...prevTasks,
            {
              ...data,
              id: prevTasks.length,
              start: start,
              end: end,
              progress: 100,
              project: projectId,
              isDisabled: true,
              displayOrder: prevTasks.length,
              dependencies: [prevTasks[prevTasks.length - 1].id],
              type: 'task',
              styles: {
                progressColor: colors.progressSelectedColor,
                progressSelectedColor: colors.progressSelectedColor
              }
            }
          ]

          const sortedTasks = SortGanttChart(tasks as Task[])
          return sortedTasks
        })
    })

    socket.on('tasksUpdate', (updatedTasks: task[]) => {
      projectId === updatedTasks[0].projectId &&
        setTasks((prevTasks) => {
          // update the upcoming tasks with the old ones
          const tasks = prevTasks.map((prevTask) => {
            const updatedTask = updatedTasks.find((task) => task._id === prevTask.id)
            if (updatedTask) {
              const startDate = new Date(updatedTask.startDate) || new Date()
              const endDate = new Date(updatedTask.deadline) || new Date()

              let start = getMidDayStart(startDate)
              let end = getMidDayEnd(endDate)
              let colors = colorCombinations.find(
                (color) => color.status === updatedTask.status.toLowerCase()
              )
              if (!colors) {
                colors = colorCombinations[4]
              }
              return {
                ...updatedTask,
                id: prevTask.id,
                start: start,
                end: end,
                progress: 100,
                isDisabled: true,
                type: 'task',
                displayOrder: prevTask.displayOrder,
                dependencies: prevTask.dependencies,
                project: projectId,
                styles: {
                  progressColor: colors.progressSelectedColor,
                  progressSelectedColor: colors.progressSelectedColor
                }
              }
            }
            return prevTask
          })

          let sortedTasks = SortGanttChart(tasks as Task[])
          sortedTasks.map((t) => {
            if (t.type === 'project') {
              const percentageDone = calculateDonePercentage(sortedTasks as unknown as task[])
              t.progress = percentageDone
              return t
            } else return t
          })

          const [start, end] = getStartEndDateForProject(sortedTasks, projectId)
          const project = sortedTasks[sortedTasks.findIndex((t) => t.id === projectId)]
          if (
            project.start.getTime() !== start.getTime() ||
            project.end.getTime() !== end.getTime()
          ) {
            const changedProject = { ...project, start, end }
            sortedTasks = sortedTasks.map((t) => (t.id === projectId ? changedProject : t))
          }

          return sortedTasks
        })
    })

    socket.on('taskUpdate', (task: task) => {
      if (projectId === task.projectId) {
        setTasks((prevTasks) => {
          const startDate = new Date(task.startDate) || new Date()
          const endDate = new Date(task.deadline) || new Date()
          let colors = colorCombinations.find((color) => color.status === task.status.toLowerCase())
          if (!colors) {
            colors = colorCombinations[4]
          }
          const newTasks = prevTasks.map((prevTask) => {
            if (prevTask.id === task._id) {
              let start = getMidDayStart(startDate)
              let end = getMidDayEnd(endDate)
              return {
                ...task,
                id: prevTask.id,
                start: start,
                end: end,
                type: 'task',
                isDisabled: true,
                project: projectId,
                displayOrder: prevTask.displayOrder,
                dependencies: prevTask.dependencies,
                progress: 100,
                styles: {
                  progressColor: colors.progressSelectedColor,
                  progressSelectedColor: colors.progressSelectedColor
                }
              }
            }
            return prevTask
          })

          let sortedTasks = SortGanttChart(newTasks as Task[])
          sortedTasks.map((t) => {
            if (t.type === 'project') {
              const percentageDone = calculateDonePercentage(sortedTasks as unknown as task[])
              t.progress = percentageDone
              return t
            } else return t
          })

          const [start, end] = getStartEndDateForProject(sortedTasks, projectId)
          const project = sortedTasks[sortedTasks.findIndex((t) => t.id === projectId)]
          if (
            project.start.getTime() !== start.getTime() ||
            project.end.getTime() !== end.getTime()
          ) {
            const changedProject = { ...project, start, end }
            sortedTasks = sortedTasks.map((t) => (t.id === projectId ? changedProject : t))
          }

          return sortedTasks
        })
      }
    })

    socket.on('taskDeleted', (taskId: string) => {
      setTasks((prevTasks) => {
        const tasks = prevTasks.filter((prevTask) => prevTask.id !== taskId)
        const sortedTasks = SortGanttChart(tasks)
        return sortedTasks
      })
    })

    return () => {
      socket.off('taskCreate')
      socket.off('taskUpdate')
      socket.off('taskDeleted')
      socket.off('tasksUpdate')
    }
  }, [])

  return (
    <Card className="flex h-full w-full flex-1 flex-col">
      <ViewSwitcher
        onViewModeChange={(viewMode) => setView(viewMode)}
        onViewListChange={setShowTaskList}
        isChecked={showTaskList}
        viewMode={view}
      />
      <CardContent className="h-full w-full pb-4">
        <div ref={subContentRef} className="relative h-full w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner className="!border !border-black !border-t-transparent" />
            </div>
          ) : (
            <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2">
              {tasks.length > 0 ? (
                <Gantt
                  ganttHeight={height}
                  columnWidth={columnWidth}
                  viewMode={view}
                  tasks={tasks}
                  listCellWidth={showTaskList ? '150px' : ''}
                  onProgressChange={() => {}}
                  arrowIndent={5}
                  headerHeight={43}
                  rowHeight={40}
                  handleWidth={0}
                  TooltipContent={(object) => <TaskTooltip task={object.task} />}
                  TaskListHeader={(object) => <TaskListHeader height={object.headerHeight} />}
                  TaskListTable={(object) => <TaskListTable object={object} />}
                />
              ) : (
                <div className="flex flex-col items-center justify-center -space-y-2">
                  <EmptyFolder className="h-[4rem] w-[4rem] opacity-50" />
                  <p className="italic opacity-50">No tasks found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="h-fit text-nowrap px-4 pb-4">
        <div className="flex flex-row items-center gap-3 font-medium">
          <div className="flex flex-row items-center gap-1.5">
            <div className="mb-0.5 h-4 w-4 rounded-md bg-[#a3a3a3]" />
            <p className="text-sm">To Be Done</p>
          </div>
          <div className="flex flex-row items-center gap-1.5">
            <div className="mb-0.5 h-4 w-4 rounded-md bg-[#fbbf24]" />
            <p className="text-sm">In Progress</p>
          </div>
          <div className="flex flex-row items-center gap-1.5">
            <div className="mb-0.5 h-4 w-4 rounded-md bg-[#3b82f6]" />
            <p className="text-sm">In Review</p>
          </div>
          <div className="flex flex-row items-center gap-1.5">
            <div className="mb-0.5 h-4 w-4 rounded-md bg-[#4ade80]" />
            <p className="text-sm">Done</p>
          </div>
          <div className="flex flex-row items-center gap-1.5">
            <div className="mb-0.5 h-4 w-4 rounded-md bg-[#f87171]" />
            <p className="text-sm">Blocked</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
