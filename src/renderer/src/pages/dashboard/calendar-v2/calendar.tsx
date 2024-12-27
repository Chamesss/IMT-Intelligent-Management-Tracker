import '@fullcalendar/core/main.css'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import '@fullcalendar/daygrid/main.css'
import FullCalendar from '@fullcalendar/react'

export default function Calendar() {
  return (
    <div className="h-full w-full bg-red-200">
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
    </div>
  )
}
