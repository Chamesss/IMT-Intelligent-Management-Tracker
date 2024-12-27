import { ChatContext } from '@/contexts/chat-provider'
import { useContext } from 'react'

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within an ChatProvider')
  }
  return context
}
