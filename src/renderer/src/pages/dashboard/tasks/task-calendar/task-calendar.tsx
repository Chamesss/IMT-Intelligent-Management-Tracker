import EmptyFolder from '@/assets/misc/empty'
import Spinner from '@/components/spinner'
import api from '@/hooks/useAxiosInterceptor'
import { useSocket } from '@/hooks/useSocket'
//import useThemeMode from '@/hooks/useTheme'
import { Card } from '@/ui/card'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import GanttChart from './components/gantt-chart'
import { SortGanttChart } from './components/sort'
import './dark-mode.css'

export interface Task extends task {
  id: number
  name: string
  start: Date
  end: Date
  styles: {
    progressColor: string
    progressSelectedColor: string
  }
}

export default function TaskCalendar() {
  //const { mode } = useThemeMode()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const socket = useSocket()
  const projectId = location.state.projectId

  const colorCombinations = [
    { progressColor: '#3b82f6', progressSelectedColor: '#3b82f6A9', status: 'inreview' }, // pink
    { progressColor: '#fbbf24', progressSelectedColor: '#fbbf24A9', status: 'inprogress' }, // light blue
    { progressColor: '#f87171', progressSelectedColor: '#f87171A9', status: 'blocked' }, // red
    { progressColor: '#4ade80', progressSelectedColor: '#4ade80A9', status: 'done' }, // light green
    { progressColor: '#a3a3a3', progressSelectedColor: '#a3a3a3A9', status: 'tobedone' } // lavender
  ]
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const response = await api.get(`/api/task/tasks/${projectId}`)
        if (response.data.length === 0) return

        const tasks = response.data.tasks.map((task: task, i: number) => {
          let colors = colorCombinations.find((color) => color.status === task.status.toLowerCase())
          if (!colors) {
            colors = colorCombinations[4]
          }
          const startDate = (new Date(task.startDate) || new Date()).toLocaleDateString()
          const endDate = (new Date(task.deadline) || new Date()).toLocaleDateString()

          return {
            ...task,
            id: i,
            start: new Date(startDate),
            end: new Date(endDate),
            styles: {
              progressColor: colors.progressColor,
              progressSelectedColor: colors.progressSelectedColor
            }
          }
        })
        const sortedTasks = SortGanttChart(tasks)
        setTasks(sortedTasks)
      } catch (error) {
        toast.error('Error fetching tasks')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    socket.on('taskCreate', (data: task) => {
      projectId === data.projectId &&
        setTasks((prevEvents) => {
          const startDate = (new Date(data.startDate) || new Date()).toLocaleDateString()
          const endDate = (new Date(data.deadline) || new Date()).toLocaleDateString()
          let colors = colorCombinations.find((color) => color.status === data.status.toLowerCase())
          if (!colors) {
            colors = colorCombinations[4]
          }
          const task = [
            ...prevEvents,
            {
              ...data,
              id: prevEvents.length,
              start: new Date(startDate),
              end: new Date(endDate),
              styles: {
                progressColor: colors.progressColor,
                progressSelectedColor: colors.progressSelectedColor
              }
            }
          ]

          const sortedTasks = SortGanttChart(task)
          return sortedTasks
        })
    })

    socket.on('taskUpdate', (updatedTask: task) => {
      projectId === updatedTask.projectId &&
        setTasks((prevEvents) => {
          const tasks = prevEvents.map((event) => {
            if (event._id === updatedTask._id) {
              const startDate = (new Date(updatedTask.startDate) || new Date()).toLocaleDateString()
              const endDate = (new Date(updatedTask.deadline) || new Date()).toLocaleDateString()
              let colors = colorCombinations.find(
                (color) => color.status === updatedTask.status.toLowerCase()
              )
              if (!colors) {
                colors = colorCombinations[4]
              }
              return {
                ...updatedTask,
                id: event.id,
                start: new Date(startDate),
                end: new Date(endDate),
                styles: {
                  progressColor: colors.progressColor,
                  progressSelectedColor: colors.progressSelectedColor
                }
              }
            }
            return event
          })
          const sortedTasks = SortGanttChart(tasks)
          return sortedTasks
        })
    })

    socket.on('tasksUpdate', (updatedTasks: task[]) => {
      projectId === updatedTasks[0].projectId &&
        setTasks((prevEvents) => {
          // update the upcoming tasks with the old ones
          const tasks = prevEvents.map((event) => {
            const updatedTask = updatedTasks.find((task) => task._id === event._id)
            if (updatedTask) {
              const startDate = (new Date(updatedTask.startDate) || new Date()).toLocaleDateString()
              const endDate = (new Date(updatedTask.deadline) || new Date()).toLocaleDateString()
              let colors = colorCombinations.find(
                (color) => color.status === updatedTask.status.toLowerCase()
              )
              if (!colors) {
                colors = colorCombinations[4]
              }
              return {
                ...updatedTask,
                id: event.id,
                start: new Date(startDate),
                end: new Date(endDate),
                styles: {
                  progressColor: colors.progressColor,
                  progressSelectedColor: colors.progressSelectedColor
                }
              }
            }
            return event
          })

          const sortedTasks = SortGanttChart(tasks)
          return sortedTasks
        })
    })

    socket.on('taskDeleted', (taskId: string) => {
      setTasks((prevEvents) => {
        const tasks = prevEvents.filter((event) => event._id !== taskId)
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
    <div
      className={`dark:dark-mode flex w-full flex-1 flex-col overflow-hidden rounded-lg border border-input/50 bg-white p-4 dark:border-neutral-900 dark:bg-neutral-800`}
    >
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Spinner className="!border-black !border-t-transparent" />
        </div>
      ) : (
        <>
          {tasks.length > 0 && <GanttChart fetchedTasks={tasks} />}
          {tasks.length === 0 && (
            <Card className="flex-1 border-input/50">
              <div className="flex h-full w-full flex-col items-center justify-center -space-y-2">
                <EmptyFolder className="h-[4rem] w-[4rem] opacity-50" />
                <p className="italic opacity-50">No tasks found</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
