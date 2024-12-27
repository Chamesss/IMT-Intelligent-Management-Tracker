import ChatSvg from '@/assets/misc/chat-svg'
import { useChat } from '@/hooks/useChat'
import { formatDate } from '@/utils/date-formatter'
import { getProfilePictureSrc } from '@/utils/get-profile-picture-src'

export default function MessageNotifications({
  notification,
  handleOpenChange,
}: {
  notification: notifications
  handleOpenChange: (open: boolean) => void
}) {
  const { addConversation, conversations } = useChat()

  const handleNavigate = async () => {
    const conversation: TeamMember = conversations.find(
      (conversation: TeamMember) => conversation._id === notification.user._id
    )
    addConversation(
      conversation._id,
      conversation.name,
      conversation.profilePicture,
      conversation.role,
      conversation.status,
      conversation.activity_status,
      notification.messageId
    )
    handleOpenChange(false)
  }

  return (
    <div
      onClick={handleNavigate}
      className="flex w-full cursor-pointer flex-row items-center justify-between border-b border-b-input px-3 py-2 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <div className="flex w-full flex-row items-start">
        <ChatSvg />
        <div className="ml-2 flex flex-col items-start gap-1">
          <div className="flex flex-row items-center gap-2">
            <img
              src={getProfilePictureSrc(notification.user.profilePicture, notification.user.name)}
              className="h-10 w-10 rounded-md"
            />
            <div className="flex flex-col">
              <h1 className="text-start font-dm text-sm font-semibold">{notification.user.name}</h1>
              <h1 className="font-dm text-sm font-semibold">{notification.action}</h1>
            </div>
          </div>
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
