import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Badge } from '@/ui/badge'
import { useEffect, useState } from 'react'
import UserChipSkeleton from '../skeletons/user-chip'

export default function GetUserNamePic({ userId, index }: { userId: string; index: number }) {
  const [user, setUser] = useState<userState | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const api = useAxiosInterceptors()

  useEffect(() => {
    const fetchUsername = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/api/user/info/${userId}`)
        setUser(response.data.user)
      } catch (e) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchUsername()
  }, [])

  if (loading) return <UserChipSkeleton />
  if (error) return null
  if (user)
    return (
      <Badge
        key={index}
        variant="secondary"
        className="flex h-[2rem] items-end gap-2 py-[0.15rem] !pr-2 pl-[0.25rem] dark:bg-white/20"
      >
        <Avatar className="h-[1.5rem] w-[1.5rem] !rounded-full bg-gray-700">
          <AvatarImage src={user.profilePicture} className="object-cover" />
          <AvatarFallback className="h-full w-full bg-transparent text-white">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <small className="mb-1 text-[0.9rem] capitalize">
          {(() => {
            const username = user.name.split(' ')[0]
            return username.length > 8 ? `${username.slice(0, 8)}...` : username
          })()}
        </small>
      </Badge>
    )
  return null
}
