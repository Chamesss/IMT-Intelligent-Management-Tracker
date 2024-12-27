import { useAuth } from '@/hooks/useAuth'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { handleError } from '@/middlewares/error-mapping'

export default async function getTaskAssignedUsername(userIds: string[]) {
  const { logout } = useAuth()
  const api = useAxiosInterceptors()
  let usernames = []
  for (const id of userIds) {
    try {
      const response = await api.get(`/api/user/info/${id}`)
      //@ts-ignore
      usernames.push(response.data.username)
    } catch (error) {
      handleError(error, logout)
    }
  }
  return usernames
}
