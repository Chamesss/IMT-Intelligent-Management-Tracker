import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/date-formatter'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export function DatePicker({
  date,
  setDate,
  title,
  touchFix = false,
  minStartDate = new Date(),
  classNameButton = '',
  classNameMain = ''
}: {
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  title?: string
  touchFix?: boolean
  minStartDate?: Date
  classNameButton?: string
  classNameMain?: string
}) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (date) {
      setOpen(false)
    }
  }, [date])

  return (
    <div className={cn('flex h-fit w-full flex-col gap-3', classNameMain)}>
      <Label htmlFor="type">{title || 'Deadline'}</Label>
      <Popover onOpenChange={setOpen} open={open} modal={touchFix || false}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'h-[3rem] w-full justify-start px-4 text-left font-normal',
              !date && 'text-muted-foreground',
              classNameButton
            )}
          >
            {(!date || isNaN(new Date(date).getTime())) && (
              <CalendarIcon className="mr-2 h-4 w-4" />
            )}
            {date && !isNaN(new Date(date).getTime()) ? (
              <> {formatDate(date.toDateString())}</>
            ) : (
              'Pick a date'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            disabled={(date) =>
              date <= new Date(new Date(minStartDate).setDate(minStartDate.getDate() - 1))
            }
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
