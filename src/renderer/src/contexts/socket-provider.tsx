import { createContext, useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'

export const SocketContext = createContext<any>(null)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socket = useMemo(() => {
    const SOCKET_URL = import.meta.env.VITE_KEY_API_URL
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      timeout: 60000,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      autoConnect: true,
      query: {
        userId: JSON.parse(localStorage.getItem('user') || '{}')._id
      }
    })
    return newSocket
  }, [])

  useEffect(() => {
    return () => {
      socket.disconnect()
    }
  }, [socket])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
