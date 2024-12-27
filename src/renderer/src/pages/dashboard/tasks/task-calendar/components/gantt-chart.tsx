import Transition from '@/components/transition'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Card, CardContent, CardFooter } from '@/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Task } from '../task-calendar'
import GanttRow from './gantt-row'

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export default function MonthlyGranttChart({ fetchedTasks }: { fetchedTasks: Task[] }) {
  const currentDate = new Date()
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
  const [tasks, setTasks] = useState<Task[]>([])
  const [dragging, setDragging] = useState<{
    id: number
    type: 'move' | 'resize'
    startX: number
    originalStart: Date
    originalEnd: Date
  } | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const rowRef = useRef<HTMLDivElement>(null)
  const [dayWidth, setDayWidth] = useState(0)

  useEffect(() => {
    setTasks(fetchedTasks)
  }, [fetchedTasks])

  const calculateWidth = () => {
    if (rowRef.current) {
      const parentWidth = rowRef.current.offsetWidth // Get the width of the parent
      const calculatedWidth = parentWidth / daysInMonth // Calculate width per day
      setDayWidth(calculatedWidth) // Set the calculated width in state
    }
  }

  useEffect(() => {
    calculateWidth() // Initial width calculation
    window.addEventListener('resize', calculateWidth)
    setTimeout(() => {
      calculateWidth()
    }, 5)
    return () => {
      window.removeEventListener('resize', calculateWidth) // Clean up event listener on unmount
    }
  }, [daysInMonth])

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     if (dragging && chartRef.current) {
  //       const chartRect = chartRef.current.getBoundingClientRect()
  //       const mouseX = e.clientX - chartRect.left
  //       const daysMoved = Math.round((mouseX - dragging.startX) / dayWidth)

  //       setTasks((prevTasks) =>
  //         prevTasks.map((task) => {
  //           if (task.id === dragging.id) {
  //             const newStart = new Date(dragging.originalStart)
  //             newStart.setDate(newStart.getDate() + daysMoved)

  //             if (dragging.type === 'move') {
  //               const duration = task.end.getTime() - task.start.getTime()
  //               const newEnd = new Date(newStart.getTime() + duration)
  //               return { ...task, start: newStart, end: newEnd }
  //             } else if (dragging.type === 'resize') {
  //               const newEnd = new Date(dragging.originalEnd)
  //               newEnd.setDate(newEnd.getDate() + daysMoved)
  //               if (newEnd < task.start) return { ...task }
  //               return { ...task, end: newEnd }
  //             }
  //           }
  //           return task
  //         })
  //       )
  //     }
  //   }

  //   const handleMouseUp = () => {
  //     setDragging(null)
  //   }

  //   document.addEventListener('mousemove', handleMouseMove)
  //   document.addEventListener('mouseup', handleMouseUp)

  //   return () => {
  //     document.removeEventListener('mousemove', handleMouseMove)
  //     document.removeEventListener('mouseup', handleMouseUp)
  //   }
  // }, [dragging, dayWidth])

  const changeMonth = (increment: number) => {
    setCurrentMonth((prevMonth) => {
      let newMonth = prevMonth + increment
      let newYear = currentYear

      if (newMonth > 11) {
        newMonth = 0
        newYear++
      } else if (newMonth < 0) {
        newMonth = 11
        newYear--
      }

      setCurrentYear(newYear)
      return newMonth
    })
  }

  return (
    <Card className="flex h-full w-full flex-1 flex-col pb-2 pt-6">
      <CardContent className="flex h-fit flex-1 flex-col !py-0">
        <div className="mb-2 flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold">
            {months[currentMonth]} {currentYear}
          </span>
          <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Transition trigger={currentMonth}>
          <div className="z-[2] flex w-full min-w-[600px] flex-1 flex-col" ref={chartRef}>
            <div className="z-[1] flex w-full py-1">
              <p className="w-[8.25rem] shrink-0 truncate text-nowrap"></p>
              <div className="flex w-full">
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <div
                    key={i}
                    className="flex w-full items-center justify-center bg-transparent p-0.5 text-center text-sm"
                  >
                    <span className="h-full w-full rounded-lg bg-neutral-100 p-0.5 text-black">
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={cn(
                'relative z-[2] h-full max-h-[45vh] w-full overflow-x-hidden transition-all',
                tasks.length < 5 ? 'overflow-visible' : 'overflow-auto'
              )}
              //style={{ overflowX: 'hidden' }}
            >
              {tasks.map((task, i: number) => (
                <GanttRow
                  key={task.id}
                  task={task}
                  tasks={tasks}
                  daysInMonth={daysInMonth}
                  dayWidth={dayWidth}
                  rowRef={rowRef}
                  currentMonth={currentMonth}
                  currentYear={currentYear}
                  index={i}
                />
              ))}
            </div>
          </div>
        </Transition>
      </CardContent>
      <CardFooter className="h-fit px-4 py-1">
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
