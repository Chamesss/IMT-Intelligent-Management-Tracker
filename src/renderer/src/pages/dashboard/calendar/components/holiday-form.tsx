import { DatePicker } from '@/components/date-picker'
import Spinner from '@/components/spinner'
import { useAuth } from '@/hooks/useAuth'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { Button } from '@/ui/button'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Textarea } from '@/ui/textarea'
import { formatDate } from '@/utils/date-formatter'
import { gradientStyle } from '@/utils/gradient'
import { AxiosError } from 'axios'
import { Armchair } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function HolidayForm({
  date,
  setHolidayModalOpen
}: {
  date: Date
  setHolidayModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [endDate, setEndDate] = useState<Date>()
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { userGlobal }: { userGlobal: userState } = useAuth()
  const api = useAxiosInterceptors()

  const submitRequestHoliday = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!reason || !endDate) {
      toast.error('Please fill out all fields')
      return
    }
    if (endDate < date) {
      toast.error('End date cannot be before start date')
      return
    }
    setLoading(true)
    try {
      const data = {
        start_date: date.toString(),
        end_date: endDate?.toString() || '',
        reason: reason,
        companyId: userGlobal.companyId
      }
      const response = await api.post('/api/holiday/add-holiday', data)
      if (response.status.toString() === '201') {
        toast.success('Holiday request submitted successfully')
        setHolidayModalOpen(false)
      }
      response.status.toString() === '201' && setHolidayModalOpen(false)
    } catch (e: unknown | AxiosError | Error) {
      toast.error('An error occurred. Please try again.')
      if (e instanceof Error) {
        setError(e.message)
      }
      if (e instanceof AxiosError) {
        setError(e.response?.data.message)
      }
      console.log(e)
      //handleError(e, logout)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setError('')
  }, [endDate, reason])

  return (
    <DialogContent>
      <DialogHeader>
        <div
          style={gradientStyle}
          className="absolute left-1/2 top-0 h-[1rem] w-full -translate-x-1/2 rounded-t-lg"
        >
          <div className="noisy" />
        </div>
        <DialogTitle className="opacity-80">
          <Armchair className="mb-1 mr-3 inline-block h-6 w-6" />
          Request a Holiday
        </DialogTitle>
        <DialogDescription>
          Fill out the form below to request time off from work.
        </DialogDescription>
      </DialogHeader>
      <form className="grid gap-4 px-6 py-4" onSubmit={submitRequestHoliday}>
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="text"
              value={formatDate(date.toISOString()).toString()}
              disabled
              className="h-[3rem] rounded-md"
            />
          </div>
          <DatePicker
            date={endDate}
            setDate={setEndDate}
            title="End Date"
            touchFix={true}
            minStartDate={new Date(date)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            placeholder="Provide details about your holiday request..."
            className="resize-none"
            onChange={(e) => setReason(e.target.value)}
            value={reason}
          />
        </div>
        <div className="relative w-full">
          <Button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-black dark:text-white dark:hover:text-opacity-80"
          >
            {loading ? (
              <Spinner className="mx-auto !border-white !border-t-transparent" />
            ) : (
              'Submit request'
            )}
          </Button>
          {error && (
            <p className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-nowrap text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
      </form>
    </DialogContent>
  )
}
