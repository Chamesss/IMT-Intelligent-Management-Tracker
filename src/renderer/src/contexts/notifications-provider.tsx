import { createContext, useState } from 'react'

export const NotificationsContext = createContext<any | undefined>(undefined)
export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState<notifications[] | undefined>()

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  )
}
