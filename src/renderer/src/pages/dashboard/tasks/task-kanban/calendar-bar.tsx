import { days, months } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Calendar } from '@/ui/calendar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/ui/dropdown-menu'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'

export default function CalendarBar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)
  const [daySelected, setDaySelected] = useState<string>(() => selectedDate.getDate().toString())
  const calendarBarRef = useRef<HTMLDivElement>(null)

  const handleDateChange = (date: Date | undefined) => {
    typeof date !== 'undefined' && setSelectedDate(date)
    setDaySelected(date?.getDate().toString() || '')
    setOpen(false)
  }
  const handleChangeDateByClick = (day: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), Number(day)))
    setDaySelected(day.toString())
  }

  const handleScroll = (event: 'left' | 'right') => {
    calendarBarRef.current?.scrollBy({
      left: event === 'left' ? -100 : (event === 'right' && 100) || 0,
      behavior: 'smooth'
    })
  }

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay()
  return (
    <div className="flex w-full items-center gap-1 rounded-xl border-[0.12rem] border-custom bg-white px-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2 border-none bg-white text-black outline-none hover:bg-white hover:text-opacity-60">
            <span className="font-medium">{months[selectedDate.getMonth()]}</span>
            <span className="font-medium">{selectedDate.getFullYear()}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="mt-2 w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date: Date | undefined) => handleDateChange(date)}
            className="p-0 [&>div]:gap-6 [&>div]:space-x-0 [&_td]:h-10 [&_td]:w-10 [&_th]:w-10"
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <ChevronLeft
        onClick={() => handleScroll('left')}
        className="cursor-pointer transition-all hover:opacity-70"
      />
      <div
        ref={calendarBarRef}
        className="scrollbar-x box-content flex flex-row flex-nowrap gap-4 overflow-x-auto px-4 py-3"
      >
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day, index) => (
          <div
            key={index}
            onClick={() => handleChangeDateByClick(day)}
            className={cn(
              `group relative flex h-10 w-10 flex-none cursor-pointer flex-col items-center justify-center !p-4 text-center text-sm font-medium`,
              {
                'font-semibold text-black': daySelected === day.toString(),
                'text-gray-500': daySelected !== day.toString()
              }
            )}
          >
            <p className="">{days[(index + firstDayOfMonth) % 7]}</p>
            <p className="font-semibold">{day}</p>
            <div className="absolute bottom-[-20%] h-[5px] w-[0rem] rounded-full bg-neutral-600 transition-all group-hover:w-[2.5rem]" />
            <div
              className={cn(
                'absolute bottom-[-20%] h-[5px] w-[2.5rem] rounded-full bg-black transition-all',
                {
                  hidden: daySelected !== day.toString()
                }
              )}
            />
          </div>
        ))}
      </div>
      <ChevronRight
        onClick={() => handleScroll('right')}
        className="cursor-pointer transition-all hover:opacity-70"
      />
    </div>
  )
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
