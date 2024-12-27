import Spinner from '@/components/spinner'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { Dialog, DialogContent } from '@/ui/dialog'
import { gradientStyle } from '@/utils/gradient'
import { Armchair } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HolidayModal({
  event,
  isOpen,
  onClose
}: {
  event: EventData | null
  isOpen: boolean
  onClose: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [vacation, setVacation] = useState<holiday | null>(null)
  const api = useAxiosInterceptors()

  useEffect(() => {
    ;(async () => {
      setError('')
      setLoading(true)
      try {
        const response = await api.get(`/api/holiday/get-holiday/${event?._id}`)
        if (response.status === 200) {
          setVacation(response.data.holidayRequest)
          console.log(response.data.holidayRequest)
        }
        setLoading(false)
      } catch (e) {
        setError('Something went wrong')
        setLoading(false)
        console.log(e)
      }
    })()
  }, [event])

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="flex min-h-[12.5rem] flex-col justify-start">
        <div
          style={gradientStyle}
          className="absolute left-1/2 top-0 h-[1rem] w-full -translate-x-1/2 rounded-t-lg"
        >
          <div className="noisy" />
        </div>
        {loading ? (
          <Spinner className="!m-auto !border-black !border-b-transparent dark:!border-white dark:!border-b-transparent" />
        ) : (
          <>
            {error ? (
              <p className="text-rose-500">{error}</p>
            ) : (
              <>
                {vacation ? (
                  <div className="h-full w-full overflow-hidden bg-white dark:bg-neutral-800">
                    <div className="p-6">
                      <h2 className="mb-6 text-2xl capitalize">
                        <Armchair className="mb-0.5 mr-2 inline-block" />
                        Vacation for
                        <h2 className="ml-2 inline-block font-bold capitalize underline">
                          {/*@ts-ignore */}
                          {vacation.userId.name}
                        </h2>
                      </h2>
                      <h4 className="mb-2 text-base font-thin capitalize">
                        Reason:
                        <span className="ml-2 font-normal">{vacation.reason}</span>
                      </h4>
                      <h4 className="mb-2 flex flex-row items-center gap-1 text-base font-thin capitalize">
                        {/* <Clock className="h-5 w-5 text-gray-400 dark:text-gray-200" /> */}
                        <span>From:</span>
                        <span className="font-normal text-gray-600 dark:text-gray-200">
                          {new Date(vacation.start_date).getDate()}/
                          {new Date(vacation.start_date).getMonth() + 1}/
                          {new Date(vacation.start_date).getFullYear()}
                        </span>
                      </h4>
                      <h4 className="mb-2 flex flex-row items-center gap-1 text-base font-thin capitalize">
                        {/* <Clock className="h-5 w-5 text-gray-400 dark:text-gray-200" /> */}
                        <span>To:</span>
                        <span className="font-normal text-gray-600 dark:text-gray-200">
                          {new Date(vacation.end_date).getDate()}/
                          {new Date(vacation.end_date).getMonth() + 1}/
                          {new Date(vacation.end_date).getFullYear()}
                        </span>
                      </h4>
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
                    <p className="text-center text-gray-500">Something went wrong</p>
                    <p className="text-center text-gray-500">
                      Please contact the administrator to submit the issue.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
