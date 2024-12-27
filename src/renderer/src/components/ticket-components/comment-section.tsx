import { useAuth } from '@/hooks/useAuth'
import api from '@/hooks/useAxiosInterceptor'
import { useChat } from '@/hooks/useChat'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/ui/dropdown-menu'
import { formatDate } from '@/utils/date-formatter'
import { EllipsisVertical } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import FileDisplay from './components/file-display'

type Props = {
  setComments: React.Dispatch<React.SetStateAction<comments[]>>
  comment: comments
  taskId: string
}

export default function CommentSection({ setComments, comment, taskId }: Props) {
  const { conversations } = useChat()
  const { userGlobal } = useAuth()
  let member: TeamMember | undefined = undefined
  member = conversations.find((member: TeamMember) => member._id === comment.userId)
  if (!member) {
    if (comment.userId === userGlobal._id) {
      member = userGlobal
    }
  }

  if (!member) return null

  const handleDeleteComment = async () => {
    try {
      const response = await api.delete(`/api/task/delete-comment/${taskId}/${comment.commentId}`)
      if (response.status === 200) {
        setComments((prev) => prev.filter((c) => c.commentId !== comment.commentId))
        toast.success('Comment deleted successfully')
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete comment')
    }
  }

  return (
    <div className="flex w-full flex-col gap-2 py-4">
      <div className="flex w-full flex-row justify-between">
        <div className="flex w-full flex-row gap-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage className="object-cover" src={member.profilePicture} />
            <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          {/* <img src={member.profilePicture} alt="profile" /> */}
          <div className="flex w-full flex-col gap-1">
            <div className="flex flex-col items-start justify-between">
              <p className="text-lg font-semibold capitalize text-black dark:text-white">
                {member.name}
              </p>
              <p className="text-xs text-gray-400">{member.role}</p>
            </div>
            <div className="flex flex-row items-center gap-2 py-1">
              <div className="h-full w-0.5 bg-black dark:bg-white" />
              <div className="flex flex-col gap-2">
                <FileDisplay comment={comment} />
                <p className="text-sm text-black dark:text-white">{comment.comment}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt)}
            </p>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="mt-4">
              <EllipsisVertical className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:border-neutral-700 dark:bg-neutral-800">
              {member._id === userGlobal._id ? (
                <React.Fragment>
                  <DropdownMenuItem
                    onClick={handleDeleteComment}
                    className="cursor-pointer text-red-400 dark:bg-neutral-800 dark:text-red-600 dark:hover:bg-neutral-700"
                  >
                    Delete
                  </DropdownMenuItem>
                </React.Fragment>
              ) : (
                <DropdownMenuItem className="cursor-pointer text-red-400 dark:bg-neutral-800 dark:text-red-600 dark:hover:bg-neutral-700">
                  Rapport a problem
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
