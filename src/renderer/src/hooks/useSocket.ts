import { SocketContext } from '@/contexts/socket-provider'
import { useContext } from 'react'

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('Socket must be used within a Socket provider')
  }
  return context
}
