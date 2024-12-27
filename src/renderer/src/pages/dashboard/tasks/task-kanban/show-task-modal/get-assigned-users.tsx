import UserChip from '@/components/user-chip'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { useEffect, useState } from 'react'

export default function GetAssignedUsers({ userId }: { userId: string }) {
  const [username, setUsername] = useState<string>('')
  const api = useAxiosInterceptors()

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await api.get(`/api/user/info/${userId}`)
        setUsername(response.data.user.name)
      } catch (e) {
        console.log(e)
        setUsername('')
        //handleError(e, logout)
      }
    }

    fetchUsername()
  }, [])

  if (!username || username.length <= 0) return null

  return <UserChip name={username} />
}
