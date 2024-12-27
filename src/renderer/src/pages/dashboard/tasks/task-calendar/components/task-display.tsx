import GetAssignedUsers from '@/components/misc/get-assigned-members'
import { Tooltip, TooltipContent, TooltipProvider } from '@/ui/tooltip'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { Task } from '../task-calendar'
//import { GripVertical } from 'lucide-react'

export default function GetTaskDisplay({
  task,
  currentYear,
  currentMonth,
  dayWidth,
  daysInMonth,
  index,
  setIsOpened,
  isOpened
}: {
  task: Task
  currentYear: number
  currentMonth: number
  dayWidth: number
  daysInMonth: number
  index: number
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>
  isOpened: boolean
}) {
  const monthStart = new Date(currentYear, currentMonth, 1)
  const monthEnd = new Date(currentYear, currentMonth + 1, 0)

  if (task.end < monthStart || task.start > monthEnd) return null
  const taskStart = Math.max(
    0,
    (task.start.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)
  )
  const taskEnd = Math.min(
    daysInMonth,
    Math.ceil((task.end.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
  )
  const width = taskEnd - taskStart
  const totalWidth =
    Math.ceil((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  if (width <= 0) return null

  let ColorWidth = 0

  if (width === totalWidth) {
    ColorWidth = width / 2
  } else if (task.start.getTime() > monthStart.getTime()) {
    if (width < totalWidth && width >= totalWidth / 2) {
      ColorWidth = totalWidth / 2
    } else if (width < totalWidth && width < totalWidth / 2) {
      ColorWidth = width
    }
  } else if (task.start.getTime() <= monthStart.getTime()) {
    if (task.end.getTime() < monthEnd.getTime()) {
      const calculateWidth = width - totalWidth / 2
      if (calculateWidth > 0) {
        ColorWidth = calculateWidth
      }
    } else {
      const start = Math.abs((task.start.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24))
      ColorWidth = totalWidth / 2 - start
    }
  }

  // const handleMouseDown = (id: number, type: 'move' | 'resize', e: React.MouseEvent) => {
  //   const task = tasks.find((t) => t.id === id)
  //   if (task && chartRef.current) {
  //     const chartRect = chartRef.current.getBoundingClientRect()
  //     setDragging({
  //       id,
  //       type,
  //       startX: e.clientX - chartRect.left,
  //       originalStart: task.start,
  //       originalEnd: task.end
  //     })
  //   }
  // }

  return (
    <div
      className={`group absolute top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-between rounded`}
      style={{
        left: `${taskStart * dayWidth}px`,
        width: `${width * dayWidth}px`,
        height: '65%',
        backgroundColor: task.styles.progressSelectedColor
      }}
      //onMouseDown={(e) => handleMouseDown(task.id, 'move', e)}
      aria-label={`Move ${task.name}`}
    >
      <TooltipProvider>
        <Tooltip onOpenChange={setIsOpened} open={isOpened}>
          <TooltipTrigger>
            <div
              onClick={() => setIsOpened((prev) => !prev)}
              className="absolute left-1/2 top-1/2 z-[3] h-full w-full -translate-x-1/2 -translate-y-1/2 transition-all group-hover:bg-black/10"
            />
            {ColorWidth > 0 && (
              <div
                className={`absolute top-1/2 z-[2] flex h-full -translate-y-1/2 items-center justify-center rounded-l`}
                style={{
                  width: `${ColorWidth * dayWidth}px`,
                  backgroundColor: task.styles.progressSelectedColor
                }}
              >
                {ColorWidth > 0 && (
                  <span className="flex-grow text-center text-xs font-medium text-white">
                    {Math.ceil(
                      (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)
                    ) +
                      1 >
                    1 ? (
                      <span className="text-nowrap">
                        {Math.ceil(
                          (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)
                        ) + 1}{' '}
                        {ColorWidth > 1 && 'Days'}
                      </span>
                    ) : (
                      <span className="text-nowrap">
                        {Math.ceil(
                          (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)
                        ) + 1}{' '}
                        {ColorWidth > 1 && 'Day'}
                      </span>
                    )}
                  </span>
                )}
              </div>
            )}
            {/* <div className="z-[3] flex h-full items-center pl-0.5 pr-0">
          <GripVertical className="!h-6 w-3 text-white opacity-75" />
        </div> */}

            {/* {task.end.getTime() <= monthEnd.getTime() && (
          <div
            className="z-[3] flex h-full w-4 cursor-e-resize items-center justify-center hover:bg-black hover:bg-opacity-10"
            onMouseDown={(e) => {
              e.stopPropagation()
              handleMouseDown(task.id, 'resize', e)
            }}
            aria-label={`Resize ${task.name}`}
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </div>
        )} */}
          </TooltipTrigger>
          <TooltipContent
            side={index >= 2 ? 'top' : 'bottom'}
            align={daysInMonth - taskStart < 5 ? 'end' : 'start'}
            sideOffset={daysInMonth - taskStart < 5 ? -15 : 15}
            alignOffset={15}
            className="h-[5rem] w-[8rem] border-none bg-slate-500/95 text-white"
            avoidCollisions={true}
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex flex-row justify-between truncate text-nowrap text-xs font-semibold">
                  <span>From: </span>
                  <span>{`${new Date(`${currentYear} / ${currentMonth} / ${taskStart + 1}`).toLocaleDateString()}`}</span>
                </div>
                <div className="flex flex-row justify-between truncate text-nowrap text-xs font-semibold">
                  <span>To: </span>
                  <span>{`${new Date(`${currentYear} / ${currentMonth} / ${taskEnd}`).toLocaleDateString()}`}</span>
                </div>
              </div>
              <GetAssignedUsers className="self-end" ids={task.membres} />
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
