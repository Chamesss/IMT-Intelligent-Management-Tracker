import { useTask } from '@/hooks/useTask'
import { formatDate } from '@/utils/date-formatter'
import { useNavigate } from 'react-router-dom'

type notificationType = 'general' | 'event' | 'work' | 'comment'
type Props = {
  notification: notifications
  handleOpenChange: (open: boolean) => void
}

export default function GeneralNotification({ notification, handleOpenChange }: Props) {
  const notificationType: notificationType = notification.type as notificationType
  const { setTaskId } = useTask()

  const navigate = useNavigate()
  const handleNavigate = () => {
    if (notificationType === 'event') {
      navigate(`/calendar`)
      handleOpenChange(false)
    }
    if (notificationType === 'comment' || notificationType === 'work') {
      console.log(notification)
      setTaskId(notification.messageId)
      navigate('/task-kanban', {
        state: {
          projectId: notification.projectId,
          pageNumber: 0,
          projectName: notification.projectName
        }
      })
      handleOpenChange(false)
    }
    // } else if (notificationType === 'work') {
    //   navigate(`/works/${notification.workId}`)
    // } else if (notificationType === 'comment') {
    //   navigate(`/works/${notification.workId}`)
    // }
  }

  return (
    <div
      onClick={handleNavigate}
      className="flex w-full cursor-pointer flex-row items-center justify-between border-b border-b-input px-3 py-2 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div className="flex w-full flex-row items-start">
        {notification.user.profilePicture && (
          <img src={notification.user.profilePicture} className="h-10 w-10 rounded-md" />
        )}
        <div className="ml-2 flex flex-col items-start">
          {/* <h1 className="text-start font-dm text-sm font-semibold">{notification.user.name}</h1> */}
          <h1 className="font-dm text-sm font-semibold">{notification.action}</h1>
          <div className="flex !h-full flex-row items-center gap-2 py-1">
            <div className="h-full !min-h-[2rem] !w-[0.15rem] rounded-full bg-black" />
            <span className="text-start font-dm text-[0.75rem] text-neutral-400">
              {notification.message}
            </span>
          </div>
          <p className="font-dm text-[0.75rem] text-neutral-400">
            {formatDate(notification.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
