import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import moment from 'moment'
import { Navigate, ToolbarProps } from 'react-big-calendar'

const CustomToolbar = (toolbar: ToolbarProps) => {
  //   const goToDate = (date) => {
  //     toolbar.onNavigate(Navigate.DATE, date)
  //   }

  return (
    <div className="flex flex-row items-center justify-between p-2 pb-4">
      <div
        className="cursor-pointer hover:underline"
        onClick={() => toolbar.onNavigate(Navigate.TODAY)}
      >
        <span className="opacity-40">Today</span>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="group cursor-pointer" onClick={() => toolbar.onNavigate(Navigate.PREVIOUS)}>
          <ChevronLeft className="transition-all group-hover:scale-105 group-active:scale-95" />
        </div>
        {(() => {
          const date = moment(toolbar.date)
          return (
            <span className="flex w-[10rem] -translate-y-[1px] flex-row justify-center gap-3 text-center text-xl">
              <b>{date.format('MMMM')}</b>
              <b>{date.format('YYYY')}</b>
            </span>
          )
        })()}
        <div className="group cursor-pointer" onClick={() => toolbar.onNavigate(Navigate.NEXT)}>
          <ChevronRight className="transition-all group-hover:scale-105 group-active:scale-95" />
        </div>
      </div>
      <div className="rbc-btn-group">
        <Button
          className={cn(
            'rounded-xl border border-custom bg-white text-black hover:border-black hover:bg-black hover:text-white dark:border-neutral-900 dark:bg-neutral-900 dark:text-white hover:dark:bg-white dark:hover:text-black',
            {
              'dark:border-custom-900 border-black bg-black text-white dark:bg-white dark:!text-black':
                toolbar.view.toLowerCase() === 'month'
            }
          )}
          type="button"
          onClick={() => toolbar.onView('month')}
        >
          Month
        </Button>
        <Button
          className={cn(
            'rounded-xl border border-custom bg-white text-black hover:border-black hover:bg-black hover:text-white dark:border-neutral-900 dark:bg-neutral-900 dark:text-white hover:dark:bg-white dark:hover:text-black',
            {
              'dark:border-custom-900 border-black bg-black text-white dark:bg-white dark:!text-black':
                toolbar.view.toLowerCase() === 'week'
            }
          )}
          type="button"
          onClick={() => toolbar.onView('week')}
        >
          Week
        </Button>
        <Button
          className={cn(
            'rounded-xl border border-custom bg-white text-black hover:border-black hover:bg-black hover:text-white dark:border-neutral-900 dark:bg-neutral-900 dark:text-white hover:dark:bg-white dark:hover:text-black',
            {
              'dark:border-custom-900 border-black bg-black text-white dark:bg-white dark:!text-black':
                toolbar.view.toLowerCase() === 'day'
            }
          )}
          type="button"
          onClick={() => toolbar.onView('day')}
        >
          Day
        </Button>
      </div>
    </div>
  )
}

export default CustomToolbar
