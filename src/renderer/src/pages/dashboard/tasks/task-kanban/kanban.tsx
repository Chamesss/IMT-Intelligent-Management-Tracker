import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { useSocket } from '@/hooks/useSocket'
import { initialColumns } from '@/lib/constants'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Column from './column'

export default function KanbanBoard() {
  const location = useLocation()
  const projectId = location.state.projectId

  const [columns, setColumns] = useState(initialColumns)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const api = useAxiosInterceptors()
  const socket = useSocket()

  useEffect(() => {
    document.body.style.pointerEvents = ''
    return () => {
      document.body.style.pointerEvents = ''
    }
  }, [setColumns, columns])

  useEffect(() => {
    ;(async () => {
      try {
        containerRef.current && setHeight(containerRef.current.clientHeight)
        const response = await api.get(`/api/task/tasks/${projectId}`)
        const updatedColumns: InitialColumns = {
          toBeDone: { ...initialColumns.toBeDone, tasks: [] },
          inProgress: { ...initialColumns.inProgress, tasks: [] },
          inReview: { ...initialColumns.inReview, tasks: [] },
          done: { ...initialColumns.done, tasks: [] },
          blocked: { ...initialColumns.blocked, tasks: [] }
        }
        response.data.tasks.forEach((task: task) => {
          const taskPlaceholder = { id: task._id, ...task }
          if (task.status.toLowerCase() === 'inreview') {
            updatedColumns.inReview.tasks.push(taskPlaceholder)
          } else if (task.status.toLowerCase() === 'inprogress') {
            updatedColumns.inProgress.tasks.push(taskPlaceholder)
          } else if (task.status.toLowerCase() === 'blocked') {
            updatedColumns.blocked.tasks.push(taskPlaceholder)
          } else if (task.status.toLowerCase() === 'done') {
            updatedColumns.done.tasks.push(taskPlaceholder)
          } else if (task.status.toLowerCase() === 'tobedone') {
            updatedColumns.toBeDone.tasks.push(taskPlaceholder)
          }
        })

        Object.keys(updatedColumns).forEach((columnKey) => {
          updatedColumns[columnKey].tasks.sort((a, b) => Number(a.order) - Number(b.order))
        })

        setColumns(updatedColumns)
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.data?.error?.toLowerCase() === 'no tasks found for this project') {
            setColumns(initialColumns)
          }
          if (error.response?.data?.error?.toLowerCase() === 'project not found') {
            setColumns(initialColumns)
          }
          //handleError(error, logout)
        }
      }
    })()
  }, [projectId])

  useEffect(() => {
    socket.on('taskCreate', (data: task) => {
      projectId === data.projectId &&
        setColumns((prevColumns) => {
          const updatedColumns = {
            ...prevColumns,
            toBeDone: {
              ...prevColumns.toBeDone,
              tasks: [...prevColumns.toBeDone.tasks, { id: data._id, ...data }]
            }
          }

          return updatedColumns
        })
    })

    socket.on('tasksUpdate', (updatedTasks: task[]) => {
      const status = updatedTasks[0].status
      setColumns((prevColumns) => {
        // Create a deep copy of the current columns state
        const updatedColumns = { ...prevColumns }

        // Remove the task from its current column (if it exists)
        Object.keys(updatedColumns).forEach((columnKey) => {
          updatedColumns[columnKey].tasks = updatedColumns[columnKey].tasks.filter(
            (task) => !updatedTasks.some((updatedTask) => updatedTask._id === task._id)
          )
        })

        // Add the task to the correct column based on its updated status
        if (status.toLowerCase() === 'inreview') {
          updatedTasks.forEach((task) => {
            updatedColumns.inReview.tasks.push({
              id: task._id,
              ...task
            })
          })
        } else if (status.toLowerCase() === 'inprogress') {
          updatedTasks.forEach((task) => {
            updatedColumns.inProgress.tasks.push({
              id: task._id,
              ...task
            })
          })
        } else if (status.toLowerCase() === 'blocked') {
          updatedTasks.forEach((task) => {
            updatedColumns.blocked.tasks.push({
              id: task._id,
              ...task
            })
          })
        } else if (status.toLowerCase() === 'done') {
          updatedTasks.forEach((task) => {
            updatedColumns.done.tasks.push({
              id: task._id,
              ...task
            })
          })
        } else if (status.toLowerCase() === 'tobedone') {
          updatedTasks.forEach((task) => {
            updatedColumns.toBeDone.tasks.push({
              id: task._id,
              ...task
            })
          })
        }

        return updatedColumns
      })
    })

    socket.on('taskUpdate', (updatedTask: task) => {
      if (updatedTask.projectId !== projectId) return
      console.log(updatedTask)

      setColumns((prevColumns) => {
        // Create a deep copy of the current columns state
        const updatedColumns = { ...prevColumns }

        // Remove the task from its current column (if it exists)
        Object.keys(updatedColumns).forEach((columnKey) => {
          updatedColumns[columnKey].tasks = updatedColumns[columnKey].tasks.filter(
            (task) => task._id !== updatedTask._id
          )
        })

        // Add the task to the correct column based on its updated status
        if (updatedTask.status.toLowerCase() === 'inreview') {
          updatedColumns.inReview.tasks.push({
            id: updatedTask._id,
            ...updatedTask
          })
        } else if (updatedTask.status.toLowerCase() === 'inprogress') {
          updatedColumns.inProgress.tasks.push({
            id: updatedTask._id,
            ...updatedTask
          })
        } else if (updatedTask.status.toLowerCase() === 'blocked') {
          updatedColumns.blocked.tasks.push({
            id: updatedTask._id,
            ...updatedTask
          })
        } else if (updatedTask.status.toLowerCase() === 'done') {
          updatedColumns.done.tasks.push({
            id: updatedTask._id,
            ...updatedTask
          })
        } else if (updatedTask.status.toLowerCase() === 'tobedone') {
          updatedColumns.toBeDone.tasks.push({
            id: updatedTask._id,
            ...updatedTask
          })
        }

        // sort the tasks based on their order
        Object.keys(updatedColumns).forEach((columnKey) => {
          updatedColumns[columnKey].tasks.sort((a, b) => Number(a.order) - Number(b.order))
        })

        return updatedColumns
      })
    })

    socket.on('taskDeleted', (taskId: string) => {
      setColumns((prevColumns) => {
        // Create a deep copy of the current columns state
        const updatedColumns = { ...prevColumns }

        // Remove the task from its current column (if it exists)
        Object.keys(updatedColumns).forEach((columnKey) => {
          updatedColumns[columnKey].tasks = updatedColumns[columnKey].tasks.filter(
            (task) => task._id !== taskId
          )
        })

        return updatedColumns
      })
    })

    return () => {
      socket.off('taskCreate')
      socket.off('tasksUpdate')
      socket.off('taskUpdate')
      socket.off('taskDeleted')
    }
  }, [])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // If dropped outside the list
    if (!destination) {
      return
    }

    // If dropped in the same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // Creating a copy of item before removing it from state
    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const [removed] = sourceColumn.tasks.splice(source.index, 1)

    if (source.droppableId === destination.droppableId) {
      // Same column task movement
      sourceColumn.tasks.splice(destination.index, 0, removed)
      handleUpdateTask(result.draggableId, destination.droppableId, sourceColumn.tasks)
    } else {
      destColumn.tasks.splice(destination.index, 0, removed)
      handleUpdateTask(result.draggableId, destination.droppableId, destColumn.tasks)
    }
  }

  const handleUpdateTask = async (completeTaskId: string, status: string, tasks: task[]) => {
    //const taskId = completeTaskId.slice(0, 24)
    tasks.forEach((task, i) => ((task.order = i), (task.status = status)))
    try {
      await api.post(`/api/task/update-order`, tasks)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <div className="mt-1 grid w-full grid-cols-5 gap-2">
        {Object.values(columns).map((column) => (
          <Column
            key={column.id}
            column={column}
            height={height}
            containerRef={containerRef}
            projectId={projectId}
          />
        ))}
      </div>
    </DragDropContext>
  )
}
