import { NotificationsContext } from '@/contexts/notifications-provider'
import { useContext } from 'react'

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
