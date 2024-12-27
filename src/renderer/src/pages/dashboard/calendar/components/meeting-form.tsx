// import AssignInputCompanyMembers from '@/components/assign-input-company-members'
import AssignInputCompanyMembers from '@/components/assign-input-company-members'
import Spinner from '@/components/spinner'
import { useAuth } from '@/hooks/useAuth'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { Button } from '@/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/ui/dialog'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Textarea } from '@/ui/textarea'
import { formatDate } from '@/utils/date-formatter'
import { gradientStyle } from '@/utils/gradient'
import { AxiosError } from 'axios'
import { RefreshCwIcon, Video } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function MeetingForm({
  date,
  setMeetingModalOpen
}: {
  date: Date
  setMeetingModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [members, setMembers] = useState<User[]>([])
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [time, setTime] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [googleMeetUrl, setGoogleMeetUrl] = useState('')
  const { userGlobal }: { userGlobal: userState } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const api = useAxiosInterceptors()

  const submitCreateMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!time || !title || !description || !members) {
      toast.error('Please fill out all fields')
      return
    }
    setLoading(true)
    try {
      const data = {
        date: date.toString(),
        time,
        name: title,
        description,
        members: selectedMembers,
        url: '123456789',
        companyId: userGlobal.companyId
      }
      const response = await api.post('/api/meeting/add-meeting', data)
      if (response.status.toString() === '201') {
        toast.success('Meeting created successfully')
        setMeetingModalOpen(false)
      }
    } catch (e: unknown | AxiosError | Error) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.message)
      }
      if (e instanceof Error) {
        setError(e.message)
      }

      console.log(e)
      //handleError(e, logout)
      setLoading(false)
    }
  }

  useEffect(() => {
    setError('')
  }, [title, description, time, members])

  const generateMeetingLink = async () => {
    try {
      //fetch url link
      setGoogleMeetUrl('response')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <DialogContent className="dark:border-neutral-700 dark:bg-neutral-800">
      <DialogHeader>
        <div
          style={gradientStyle}
          className="absolute left-1/2 top-0 h-[1rem] w-full -translate-x-1/2 rounded-t-lg"
        >
          <div className="noisy" />
        </div>
        <DialogTitle className="opacity-80">
          <Video className="mb-1 mr-3 inline-block h-6 w-6" />
          Create New Meeting
        </DialogTitle>
        <DialogDescription>Fill out the details for your new meeting.</DialogDescription>
      </DialogHeader>

      <form className="grid w-full gap-4 px-6 py-4" onSubmit={submitCreateMeeting}>
        <div className="flex w-full flex-col gap-2 overflow-auto px-1">
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="text"
                className="h-[3rem] rounded-md"
                value={formatDate(date.toISOString()).toString()}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => {
                  if (e.target.value) {
                    const [hours, minutes] = e.target.value.split(':')
                    const selectedTime = new Date()
                    selectedTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

                    const currentTime = new Date()
                    currentTime.setSeconds(0, 0)

                    if (selectedTime < currentTime) {
                      const nextHour = new Date()
                      nextHour.setHours(currentTime.getHours() + 1, 0, 0, 0)
                      setTime(nextHour.toTimeString().substring(0, 5))
                    } else {
                      setTime(e.target.value)
                    }
                  }
                }}
                className="h-[3rem] rounded-md"
                step="3600" // 3600 seconds = 1 hour
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meeting title"
              className="h-[3rem] rounded-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Meeting Description</Label>
            <Textarea
              id="description"
              placeholder="Enter meeting description"
              className="resize-none dark:bg-neutral-700"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <AssignInputCompanyMembers
            setMembers={setMembers}
            members={members}
            setSelectedMembers={setSelectedMembers}
            selectedMembers={selectedMembers}
            fixScroll={true}
          />
          <div className="space-y-2">
            <Label htmlFor="google-meet-url">Google Meet URL</Label>
            <div className="flex items-center gap-2">
              <Input
                id="google-meet-url"
                placeholder="Generate Google Meet URL"
                className="h-[3rem] rounded-md"
                disabled
                value={googleMeetUrl}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-stone-400 hover:bg-transparent hover:text-stone-900"
                onClick={generateMeetingLink}
              >
                <RefreshCwIcon className="h-4 w-4" />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <div className="relative w-full">
              {error && (
                <p className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-nowrap text-sm text-red-500">
                  {error}
                </p>
              )}
              <Button type="submit" className="mt-2 w-full rounded-2xl bg-black dark:text-white">
                {loading ? (
                  <Spinner className="mx-auto !border-white !border-t-transparent" />
                ) : (
                  'Create meeting'
                )}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </form>
    </DialogContent>
  )
}
