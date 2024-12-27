import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'
import { Task } from 'gantt-task-react'
import { useEffect, useState } from 'react'
import TaskModal from '../../task-kanban/show-task-modal/task-modal'

interface combinedTask extends Task {
  _id: string
  comments: object[]
  description: string
  membres: string[]
  status: string
}

export default function TaskListTable({
  object
}: {
  object: {
    rowHeight: number
    rowWidth: string
    fontFamily: string
    fontSize: string
    locale: string
    tasks: Task[]
    selectedTaskId: string
    setSelectedTask: (taskId: string) => void
    onExpanderClick: (task: Task) => void
  }
}) {
  return (
    <div className="w-[200px] !transition-all">
      <div className="border border-t-0">
        {object.tasks.map((task: Task) => (
          <NameDisplay task={task as combinedTask} height={object.rowHeight} key={task.id} />
        ))}
      </div>
    </div>
  )
}

const NameDisplay = ({ task, height }: { task: combinedTask; height: number }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.pointerEvents = ''
    return () => {
      document.body.style.pointerEvents = ''
    }
  }, [isOpen, setIsOpen])

  const ColumnName = task.status?.replace(/([A-Z])/g, ' $1').trim()
  const statusNotation = {
    title: ColumnName,
    status: task.status,
    color: task.styles?.progressColor || ''
  }

  return (
    <div style={{ height: height + 'px' }} className={cn('grid w-full grid-cols-1 gap-2 border-b')}>
      <div className="col-span-1 flex items-center justify-start py-1 pl-3 pr-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default truncate transition-all">
              <p
                className={cn('truncate text-sm', task.type === 'project' && 'font-semibold')}
                onClick={() => task.type !== 'project' && setIsOpen(true)}
              >
                {task.name}
              </p>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={5}
              className="w-full max-w-[14rem] rounded-md bg-gray-800 text-white transition-all"
              align="start"
            >
              <div className="flex flex-col gap-2 p-2">
                <p className="text-sm font-semibold">{task.name}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="!w-[50rem] !max-w-none bg-white dark:!border dark:border-neutral-700 dark:bg-neutral-800">
          <TaskModal task={task as unknown as task} columnName={statusNotation.title} />
        </DialogContent>
      </Dialog> */}
    </div>
  )
}
