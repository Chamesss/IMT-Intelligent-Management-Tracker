import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { cn } from '@/lib/utils'
import { Badge } from '@/ui/badge'
import { Skeleton } from '@/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  ids: string[]
  className?: string
}

export default function GetAssignedUsers({ ids, className = '' }: Props) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const api = useAxiosInterceptors()

  const fetchMembers = useCallback(async () => {
    try {
      const response = await api.get(`/api/user/get-members-data`, {
        params: {
          members: ids
        }
      })
      setMembers(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [])

  if (loading) {
    return (
      <div className={cn('flex w-fit flex-row flex-nowrap gap-2 text-xs', className)}>
        {ids.length > 0 && (
          <div className="flex flex-row items-center -space-x-2.5">
            {ids.slice(0, 2).map((_, index) => (
              <Skeleton key={index} className="h-7 w-7 rounded-full" />
            ))}
            {ids.length > 2 && (
              <div className="z-[3] flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 font-semibold text-gray-600">
                <span>+{ids.length - 2}</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex w-fit flex-row flex-nowrap gap-2 text-xs', className)}>
      {members.length > 0 ? (
        <div className="flex flex-row items-center -space-x-2.5">
          {members.slice(0, 2).map((member, index) => (
            <MemberPicture key={index} member={member} />
          ))}
          {members.length > 2 && (
            <div className="z-[3] flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 font-semibold text-gray-600">
              <span>+{members.length - 2}</span>
            </div>
          )}
        </div>
      ) : (
        <Badge variant="secondary" className="text-xs text-gray-400">
          {'-'}
        </Badge>
      )}
    </div>
  )
}

export const MemberPicture = ({ member }: { member: TeamMember }) => {
  const [imageLoading, setImageLoading] = useState(true)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative h-7 w-7">
            <img
              src={member.profilePicture}
              alt={member.name}
              className="h-full w-full rounded-full border border-gray-100 object-cover"
              onLoad={() => setImageLoading(false)}
              key={member.profilePicture}
            />
            {imageLoading && (
              <Skeleton className="absolute left-1/2 top-1/2 z-[1] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-sm font-semibold capitalize">{member.name}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
