import { useAuth } from '@/hooks/useAuth'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { useSocket } from '@/hooks/useSocket'
import useThemeMode from '@/hooks/useTheme'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Calendar as BigCalendar, Event, momentLocalizer, Views } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'
import DayCell from './components/day-cell'
import HolidayModal from './components/holiday-modal'
import MeetingModal from './components/meeting-modal'
import CustomToolbar from './custom-toolbar'

export default function Calendar() {
  const localizer = momentLocalizer(moment)
  const allViews = Object.keys(Views).map((k) => Views[k])
  const [events, setEvents] = useState([{}])
  const { userGlobal } = useAuth()
  const api = useAxiosInterceptors()
  const { mode } = useThemeMode()
  const [isOpen, setIsOpen] = useState(false)
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false)
  const [holidayEvent, setHolidayEvent] = useState<EventData | null>(null)
  const [meetingEvent, setMeetingEvent] = useState<EventData | null>(null)
  const socket = useSocket()

  useEffect(() => {
    ;(async () => {
      try {
        const responseMeetings = await api.get(
          `/api/holiday/holidays_meetings/${userGlobal.companyId}`
        )
        let events: EventData[] = []
        Object.entries(responseMeetings.data).forEach(([_, array]) => {
          ;(array as EventData[]).forEach((data) => {
            const value = {
              _id: data._id,
              title: data.title,
              start: new Date(data.start),
              end: new Date(data.end)
            }
            events.push(value)
          })
        })
        setEvents(events)
      } catch (e) {
        //handleError(e, logout)
      }
    })()
  }, [])

  useEffect(() => {
    socket.on('meetingRequest', (data: EventData) => {
      setEvents((prev: {}[]) => [
        ...prev,
        //@ts-ignore
        { _id: data._id, title: data.name, start: new Date(data.date), end: new Date(data.date) }
      ])
    })
    return () => {
      socket.off('meetingRequest')
    }
  }, [])

  const handleOpenModal = (event: Event) => {
    if (
      event.title?.toString().toLowerCase().includes('holiday') ||
      event.title?.toString().toLowerCase().includes('vacation')
    ) {
      setIsHolidayModalOpen(true)
      setHolidayEvent(event as EventData)
    } else {
      setIsOpen(true)
      setMeetingEvent(event as EventData)
    }
  }

  return (
    <div
      className={`dark:dark-mode flex w-full flex-1 flex-col overflow-hidden rounded-lg border-[0.12rem] bg-white dark:border-neutral-900 dark:bg-neutral-800 ${mode === 'dark' ? 'dark-mode' : ''} p-4`}
    >
      <BigCalendar
        localizer={localizer}
        events={events}
        step={60}
        views={allViews}
        defaultDate={new Date()}
        popup={true}
        eventPropGetter={(e) => eventStyleGetter(e, mode)}
        className="w-full overflow-visible dark:bg-neutral-800"
        components={{
          toolbar: CustomToolbar,
          month: {
            dateHeader: (props) => <DayCell props={props} />
          }
        }}
        selectable
        onSelectEvent={(event) => handleOpenModal(event)}
      />
      <MeetingModal event={meetingEvent} onClose={setIsOpen} isOpen={isOpen} />
      <HolidayModal
        event={holidayEvent}
        onClose={setIsHolidayModalOpen}
        isOpen={isHolidayModalOpen}
      />
    </div>
  )
}

export const eventStyleGetter = (event: Event, mode: string) => {
  let backgroundColor = ''
  let borderLeftColor = ''
  let borderLeftWidth = '5px'
  let textColor = ''

  if (mode === 'light') {
    if (event.title?.toString().toLowerCase().includes('holiday')) {
      backgroundColor = 'rgba(255, 195, 122, 0.3)' //purple
      borderLeftColor = 'rgba(194, 141, 78, 1)'
      textColor = 'rgba(194, 141, 78, 1)'
    } else {
      backgroundColor = 'rgba(31, 57, 255, 0.2)' //blue
      borderLeftColor = 'rgba(31, 57, 255, 1)'
      textColor = 'rgba(31, 57, 255, 1)'
    }
  } else {
    if (event.title?.toString().toLowerCase().includes('holiday')) {
      backgroundColor = 'rgba(255, 195, 122, 0.35)' //purple
      borderLeftColor = 'rgba(194, 141, 78, 1)'
      textColor = 'rgba(255, 255, 255, 1)'
    } else {
      backgroundColor = 'rgba(31, 57, 255, 0.35)' //blue
      borderLeftColor = 'rgba(31, 57, 255, 1)'
      textColor = 'rgba(255, 255, 255, 1)'
    }
  }

  const style = {
    backgroundColor: backgroundColor,
    borderLeft: `${borderLeftWidth} solid ${borderLeftColor}`,
    borderRadius: '2px',
    opacity: 0.9,
    color: textColor,
    padding: '2px',
    display: 'block',
    margin: '0 2px 2px 0px',
    fontSize: '0.8rem'
  }

  return {
    style: style
  }
}
