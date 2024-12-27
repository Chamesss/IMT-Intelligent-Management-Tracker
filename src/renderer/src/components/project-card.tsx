import IconNotes from '@/assets/svg/notes'
import { useTask } from '@/hooks/useTask'
import { cn } from '@/lib/utils'
import TaskModal from '@/pages/dashboard/tasks/task-kanban/show-task-modal/task-modal'
import { Dialog, DialogContent, DialogTrigger } from '@/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'
import { calculateDateInterval } from '@/utils/calculate-date-interval'
import { BellRing } from 'lucide-react'
import { useEffect, useState } from 'react'
import PlusItems from './misc/plus-items'
import PriorityLabel from './priority'
import Tag from './tag'

export default function ProjectCard({ task, columnName }: { task: task; columnName: string }) {
  const [open, setOpen] = useState(false)
  const { taskId, setTaskId } = useTask()
  const [overflowingTags, setOverflowingTags] = useState<number>(0)
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    if (task.tags.length > 2) {
      if (task.tags[0].length > 8) {
        task.tags[0] = task.tags[0].slice(0, 8) + '...'
      }
      if (task.tags[1].length > 8) {
        task.tags[1] = task.tags[1].slice(0, 8) + '...'
      }
      let tags: string[] = []
      tags.push(task.tags[0])
      tags.push(task.tags[1])
      setTags(tags)
      setOverflowingTags(task.tags.length - 2)
    } else {
      setTags(task.tags)
    }
  }, [])

  useEffect(() => {
    if (taskId && taskId === task._id) {
      setOpen(true)
      setTaskId(undefined)
    }
  }, [taskId])

  const displayEstimatedTime = calculateDateInterval(task.startDate, task.deadline)

  return (
    <div className="relative mx-auto w-full cursor-pointer rounded-lg border bg-white px-2 pb-1 pt-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-700">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div onClick={() => setOpen((prev) => !prev)}>
            <div className="mb-2 flex flex-row flex-wrap items-center gap-2 truncate text-xs">
              {tags.map((tag, i) => (
                <Tag key={i} tag={tag} i={i} />
              ))}
              {overflowingTags > 0 && <PlusItems overflowingTags={overflowingTags} />}
            </div>
            <div className="my-3 flex h-auto flex-row flex-wrap overflow-hidden">
              <div className="group relative truncate text-sm font-bold text-gray-900 transition-all dark:text-white">
                <IconNotes className="mr-1 inline-flex h-6 w-6 opacity-60" />
                {task.name}
              </div>
            </div>
            <div
              className={cn('mb-2 flex items-center justify-between text-xs', {
                'justify-end': !displayEstimatedTime
              })}
            >
              {displayEstimatedTime && (
                <div className="text-[#9D9BA1] dark:text-white">
                  Est. time: {displayEstimatedTime}
                </div>
              )}
              <PriorityLabel priority={task.priority} />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="!w-[50rem] !max-w-none bg-white dark:!border dark:border-neutral-700 dark:bg-neutral-800">
          <TaskModal task={task} columnName={columnName} />
        </DialogContent>
      </Dialog>

      <div className="absolute right-[1%] top-[2%]">
        {task.type === 'urgent' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative h-[1.5rem] w-[1.5rem] overflow-hidden rounded-full bg-red-500/30">
                  <div className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2">
                    <BellRing className="h-[0.9rem] w-[0.9rem] text-red-400" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-bold uppercase text-red-600">Urgent task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}
