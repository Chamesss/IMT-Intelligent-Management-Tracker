import GetUserNamePic from '@/components/misc/get-user-name-pic'
import Spinner from '@/components/spinner'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { Dialog, DialogContent } from '@/ui/dialog'
import { gradientStyle } from '@/utils/gradient'
import { AxiosError } from 'axios'
import { CalendarIcon, LinkIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function MeetingModal({
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
  const [meeting, setMeeting] = useState<meeting | null>(null)
  const api = useAxiosInterceptors()

  useEffect(() => {
    ;(async () => {
      setError('')
      setLoading(true)
      try {
        const response = await api.get(`/api/meeting/get-meeting/${event?._id}`)
        setMeeting(response.data)
      } catch (e: unknown | AxiosError) {
        if (e instanceof AxiosError) {
          setError(e.response?.data.message || e.message)
        } else {
          setError(JSON.stringify(e))
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [event])

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="flex min-h-[18rem] flex-col justify-center">
        <div
          style={gradientStyle}
          className="absolute left-1/2 top-0 h-[1rem] w-full -translate-x-1/2 rounded-t-lg"
        >
          <div className="noisy" />
        </div>{' '}
        {loading ? (
          <Spinner className="!m-auto !border-black !border-b-transparent dark:!border-white dark:!border-b-transparent" />
        ) : (
          <>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                {meeting ? (
                  <div className="h-full w-full overflow-hidden bg-white dark:bg-neutral-800">
                    <div className="p-6">
                      <h2 className="mb-4 text-2xl font-bold capitalize">{meeting.name}</h2>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-200" />
                          <span className="text-gray-600 dark:text-gray-200">
                            {new Date(meeting.date).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="h-5 w-5 text-gray-400" />
                          <a
                            href={'#'}
                            className="text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {'https://meet.google.com/abc-defg-hij'}
                          </a>
                        </div>
                        <hr className="!my-4 dark:bg-gray-200" />
                        <div>
                          <h3 className="font-semibold">Description</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-200">
                            {meeting.description}
                          </p>
                        </div>
                        <hr className="!my-4 dark:bg-gray-200" />
                        <div className="!mt-6">
                          <h3 className="font-semibold">Members</h3>
                          <div className="!mt-2 flex flex-wrap gap-2">
                            {meeting.members.map((member, index) => (
                              <GetUserNamePic key={index} userId={member} index={index} />
                            ))}
                            {meeting.members.length === 0 && (
                              <div className="w-full">
                                <p className="text-center text-sm italic text-gray-400 dark:text-gray-200">
                                  No members
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
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
