import Transition from '@/components/transition'
import { cn } from '@/lib/utils'
import { gradientStyle } from '@/utils/gradient'
import { ChartGantt, ChevronLeft, LayoutList } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function Tasks() {
  //project id to retrieve tasks related to the project
  const { state }: { state: { projectId: string; pageNumber: string; projectName: string } } =
    useLocation()
  const navigate = useNavigate()
  const location = useLocation()
  const [toNavigate, setToNavigate] = useState<string>(location.pathname.slice(1))

  useEffect(() => {
    if (location.pathname.slice(1) !== toNavigate) {
      navigate(`/${toNavigate}`, {
        state: {
          projectId: state.projectId,
          pageNumber: state.pageNumber,
          prevPathname: toNavigate === 'task-kanban' ? '/task-calendar' : '/task-kanban',
          projectName: state.projectName
        }
      })
    }
  }, [toNavigate])

  return (
    <div className="flex w-full flex-col justify-between">
      <div
        id="calendar-bar"
        className="mb-4 flex h-fit flex-col justify-between rounded-lg border-[0.12rem] border-custom bg-white px-3 pb-1 pt-3 dark:border-neutral-900 dark:bg-neutral-800"
      >
        <div
          style={gradientStyle}
          className="relative flex flex-1 items-start rounded-lg bg-gradient-to-r from-violet-500 via-blue-400 to-pink-400 px-3 py-3"
        >
          <div className="noisy" />
          <div className="z-[1] flex w-full flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-4">
              <div
                className="group cursor-pointer rounded-full bg-white/50 p-2"
                onClick={() => navigate('/dashboard', { state: state.pageNumber.toString() })}
              >
                <ChevronLeft className="font-bold text-white transition-all group-hover:opacity-70" />
              </div>
              <p className="text-dm text text-md font-semibold capitalize text-white">
                {state.projectName}
              </p>
            </div>
          </div>
        </div>
        <div className="relative flex w-fit flex-row gap-6 rounded-b-lg px-2 pb-3 pt-4">
          <p
            className={cn(
              'flex cursor-pointer flex-row items-center text-sm text-muted-foreground',
              {
                'text-black dark:text-white': toNavigate === 'task-kanban'
              }
            )}
            onClick={() => setToNavigate('task-kanban')}
          >
            <LayoutList className="mr-2 inline-block h-5 w-5" />
            Kanban board
          </p>
          <p
            className={cn(
              'flex cursor-pointer flex-row items-center text-sm text-muted-foreground',
              {
                'text-black dark:text-white': toNavigate === 'task-calendar'
              }
            )}
            onClick={() => setToNavigate('task-calendar')}
          >
            <ChartGantt className="mr-2 inline-block h-5 w-5" />
            Gantt Chart
          </p>
          <div
            className={cn(
              'absolute bottom-[-10%] h-1 w-[45%] rounded-full bg-black transition-all duration-300 ease-in-out dark:bg-white',
              {
                'translate-x-[-2%]': toNavigate === 'task-kanban',
                'translate-x-[115%]': toNavigate === 'task-calendar'
              }
            )}
          />
        </div>
      </div>
      <Transition trigger={location.pathname} className="flex h-full w-full">
        <Outlet />
      </Transition>
    </div>
  )
}
