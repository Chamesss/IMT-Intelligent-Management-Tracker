import { cn } from '@/lib/utils'
import { Badge } from '@/ui/badge'
import { Skeleton } from '@/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'
import { useState } from 'react'

type Props = {
  membres: TeamMember[]
  className?: string
}

interface AvatarUrl {
  profilePicture: string
  _id: string
  name: string
}

export default function AssignedMembers({ membres, className = '' }: Props) {
  return (
    <div className={cn('flex w-fit flex-row flex-nowrap gap-2 text-xs', className)}>
      {membres.length > 0 ? (
        <div className="flex flex-row items-center -space-x-2.5">
          {(membres || []).slice(0, 2).map((member, index) => (
            <MemberPicture key={index} member={member} />
          ))}
          {(membres || []).length > 2 && (
            <div className="z-[3] flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 font-semibold text-gray-600">
              <span>+{membres.length - 2}</span>
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

export const MemberPicture = ({ member }: { member: TeamMember | AvatarUrl }) => {
  const [imageLoading, setImageLoading] = useState(true)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative h-6 w-6">
            <img
              src={member.profilePicture}
              alt={member.name}
              className="h-full w-full rounded-full border border-gray-100 object-cover"
              onLoad={() => setImageLoading(false)}
              key={member.profilePicture}
            />
            {imageLoading && (
              <Skeleton className="absolute left-1/2 top-1/2 z-[1] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full" />
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
