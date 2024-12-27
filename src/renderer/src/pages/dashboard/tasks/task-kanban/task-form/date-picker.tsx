import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Calendar } from '@/ui/calendar'
import { Label } from '@/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { formatDate } from '@/utils/date-formatter'

export function DatePicker({
  date,
  setDate
}: {
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="opacity-80" htmlFor="type">
        Deadline
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start px-4 text-left font-normal dark:border-neutral-500 dark:bg-neutral-600 dark:text-white',
              !date && 'text-muted-foreground'
            )}
          >
            {!date && <CalendarIcon className="mr-2 h-4 w-4" />}
            {date ? <> {formatDate(date.toDateString())}</> : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            className="dark:bg-neutral-600"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
