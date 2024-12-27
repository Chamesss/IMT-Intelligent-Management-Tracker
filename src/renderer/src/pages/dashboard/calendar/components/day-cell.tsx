import { cn } from '@/lib/utils'
import { Dialog, DialogTrigger } from '@/ui/dialog'
import { Armchair, Plus, Video } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DateHeaderProps } from 'react-big-calendar'
import HolidayForm from './holiday-form'
import MeetingForm from './meeting-form'

export default function DayCell({ props }: { props: DateHeaderProps }) {
  const [open, setIsOpen] = useState(false)
  const dropDownRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<SVGSVGElement>(null)
  const [holidayModalOpen, setHolidayModalOpen] = useState(false)
  const [meetingModalOpen, setMeetingModalOpen] = useState(false)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(event.target as Node) &&
      iconRef.current &&
      !iconRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="group relative z-[50] flex h-full w-full flex-row justify-between overflow-visible px-2 py-[0.2rem]">
      <p>{props.label}</p>
      {!props.isOffRange && (
        <div
          className={cn('absolute right-0 cursor-pointer opacity-0 group-hover:opacity-100', {
            'opacity-100': open
          })}
        >
          <Plus
            ref={iconRef}
            onClick={() => setIsOpen((prev) => !prev)}
            className="h-6 w-6 rounded-full bg-black/40 p-1 text-white transition-all active:scale-95"
          />
          <div
            ref={dropDownRef}
            className={cn(
              'absolute right-0 top-[100%] z-[99] flex translate-y-0.5 flex-col items-start gap-1 overflow-hidden rounded-lg border border-white border-opacity-25 bg-neutral-600 text-white shadow-sm',
              {
                'h-fit w-fit p-1.5 transition-all': open,
                'h-0 w-0 border-none p-0 transition-none': !open
              }
            )}
          >
            <Dialog open={meetingModalOpen} onOpenChange={setMeetingModalOpen}>
              <DialogTrigger
                disabled={
                  new Date(props.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                }
                className="w-full"
              >
                <p
                  className={cn(
                    'w-full text-nowrap rounded-sm bg-white/10 px-1 text-start text-xs font-medium capitalize transition-all hover:bg-black/10',
                    {
                      'opacity-50':
                        new Date(props.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                    }
                  )}
                >
                  <Video className="w-[1.15rem]-[1.15rem] mb-0.5 mr-1 inline-block h-[1.15rem]" />
                  <span>Create Meeting</span>
                </p>
              </DialogTrigger>
              <MeetingForm date={props.date} setMeetingModalOpen={setMeetingModalOpen} />
            </Dialog>
            <Dialog open={holidayModalOpen} onOpenChange={setHolidayModalOpen}>
              <DialogTrigger
                disabled={
                  new Date(props.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                }
                className="w-full"
              >
                <p
                  className={cn(
                    'w-full text-nowrap rounded-sm bg-white/10 px-1 text-start text-xs font-medium capitalize transition-all hover:bg-black/10',
                    {
                      'opacity-50':
                        new Date(props.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                    }
                  )}
                >
                  <Armchair className="mb-0.5 mr-1 inline-block h-[1.15rem] w-[1.15rem]" />
                  <span>Reserve Vacation</span>
                </p>
              </DialogTrigger>
              <HolidayForm date={props.date} setHolidayModalOpen={setHolidayModalOpen} />
            </Dialog>
          </div>
        </div>
      )}
    </div>
  )
}
