import UserStatus from '@/components/user-status'
import { unread } from '@/contexts/chat-provider'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { getProfilePictureSrc } from '@/utils/get-profile-picture-src'

export default function ConversationCell({ conversation }: { conversation: TeamMember }) {
  const profilePicture = getProfilePictureSrc(conversation.profilePicture, conversation.name)
  const { unreadStatus }: { unreadStatus: unread[] } = useChat()
  const unreadMessages =
    unreadStatus?.find((unread: unread) => unread.senderId === conversation._id)?.read || 0
  return (
    <div className="flex cursor-pointer flex-row items-start justify-between rounded-lg px-1 py-2 hover:bg-gray-100 dark:border-black dark:hover:bg-neutral-700">
      <div className="relative flex w-full flex-row items-center gap-2">
        <div className="relative">
          <Avatar>
            <AvatarImage
              src={profilePicture}
              className="h-[2.563rem] w-[2.563rem] cursor-pointer object-cover"
            />
            <AvatarFallback>
              {conversation.name.charAt(0) + conversation.name.charAt(1)}
            </AvatarFallback>
          </Avatar>
          <UserStatus status={conversation.status} />
        </div>
        <div className="relative w-full">
          <h1
            className={cn('w-full font-dm text-base font-medium capitalize dark:text-white', {
              'font-semibold text-black': unreadMessages > 0,
              'text-black/70': unreadMessages === 0
            })}
          >
            {conversation.name}
            {unreadMessages > 0 && (
              <div className="absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-white">
                {unreadMessages}
              </div>
            )}
          </h1>
          <p className="text-ellipsis font-dm text-[0.75rem] capitalize text-gray-500">
            {conversation.role}
          </p>
          {conversation.activity_status &&
            conversation.activity_status.toLowerCase() === 'in tracking' && (
              <p className="text-sm text-blue-700">{conversation.activity_status}</p>
            )}
        </div>
      </div>
    </div>
  )
}
