import api from '@/hooks/useAxiosInterceptor'
import { Skeleton } from '@/ui/skeleton'
import { AxiosError } from 'axios'
import { Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function StatusBoxTotalHoursDay() {
  const [loading, setLoading] = useState<boolean>(true)
  const [dailyProgress, setDailyProgress] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const response = await api.get(`/api/user/get-daily-progress/${new Date().toString()}`)
        console.log(response.data)
        setDailyProgress(response.data)
      } catch (error: unknown | AxiosError) {
        toast.error('Error fetching data')
      } finally {
        setLoading(false)
      }
    })()
  }, [api])

  return (
    <div className="flex h-[7rem] w-full items-center justify-center rounded-lg border-[0.12rem] border-custom bg-white px-4 dark:border-neutral-900 dark:bg-neutral-800">
      <div className="flex w-full flex-row items-center justify-start gap-4">
        <div className="flex h-[3.2rem] w-[3.2rem] rounded-full bg-[#F7F7F7] p-3">
          <Timer className="h-full w-full text-black" />
        </div>
        <div>
          <p className="text-nowrap text-sm text-mediumGray">Total Hours This Day</p>
          {loading ? (
            <Skeleton className="h-[2.25rem] w-[5rem] rounded-full dark:bg-neutral-700" />
          ) : (
            <div>
              <p className="text-[1.5rem] font-bold">{dailyProgress} H</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
