import { Dialog, DialogContent } from '@/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'
import { useState } from 'react'
import TaskModal from '../../task-kanban/show-task-modal/task-modal'
import { Task } from '../task-calendar'
import GetTaskDisplay from './task-display'

export default function GanttRow({
  task,
  tasks,
  daysInMonth,
  dayWidth,
  rowRef,
  currentYear,
  currentMonth,
  index
}: {
  task: Task
  tasks: Task[]
  daysInMonth: number
  dayWidth: number
  rowRef: React.RefObject<HTMLDivElement>
  currentYear: number
  currentMonth: number
  index: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const ColumnName = task.status.replace(/([A-Z])/g, ' $1').trim()

  return (
    <div
      key={task.id}
      className="relative flex h-[2.5rem] items-center"
      style={{
        zIndex: isOpened ? tasks.length + 1 : index
      }}
    >
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="!w-[50rem] !max-w-none bg-white dark:!border dark:border-neutral-700 dark:bg-neutral-800">
          <TaskModal task={task} columnName={ColumnName} />
        </DialogContent>
      </Dialog>
      <div
        className={`z-[1] flex h-full shrink-0 items-center justify-center text-nowrap bg-white pl-1 pr-2 ${
          task.id === tasks.length ? '' : 'border-t border-gray-200'
        }`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full truncate">
              <p
                onClick={() => setIsOpen(true)}
                className="w-[7.5rem] truncate text-start text-sm font-medium hover:underline"
              >
                {task.name}
              </p>
            </TooltipTrigger>
            <TooltipContent
              align={task.name.length < 8 ? 'start' : 'end'}
              className="bg-slate-900/80 text-white"
            >
              <p className="max-w-[7rem] text-wrap text-sm font-medium">{task.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div ref={rowRef} className={`relative z-[2] h-full flex-1 shrink-0 overflow-visible`}>
        <div
          className={`absolute left-0 top-0 z-[0] grid h-full`}
          style={{
            gridTemplateColumns: `repeat(${daysInMonth}, ${dayWidth}px)`
          }}
          aria-hidden="true"
        >
          {Array.from({ length: daysInMonth }).map((_, index) => (
            <div
              key={index}
              className={`border-t w-[${dayWidth}px] ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            />
          ))}
        </div>

        <GetTaskDisplay
          task={task}
          currentYear={currentYear}
          currentMonth={currentMonth}
          dayWidth={dayWidth}
          daysInMonth={daysInMonth}
          index={index}
          setIsOpened={setIsOpened}
          isOpened={isOpened}
        />
      </div>
    </div>
  )
}
