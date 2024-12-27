import { createContext, useState } from 'react'

export type unread = {
  senderId: string
  read: number
}

export const ChatContext = createContext<any | undefined>(undefined)
export const ChatProvider = ({ children }) => {
  const [conversationsOpened, setConversationsOpened] = useState<conversationOpened[]>([])
  const [unreadStatus, setUnreadStatus] = useState<unread>()
  const [conversations, setConversations] = useState<TeamMember[]>([])

  const addConversation = (
    id: string,
    name: string,
    profilePicture: string,
    role: string,
    status: 'online' | 'offline',
    activity_status: string,
    messageIdToScroll: string | null = null
  ) => {
    if (conversationsOpened.find((conversation) => conversation.userId === id)) {
      setConversationsOpened((prev) => {
        const conversationIndex = prev.findIndex((conversation) => conversation.userId === id)
        if (conversationIndex < 0) return [...prev]

        const newConversations = [...prev]
        newConversations[conversationIndex] = {
          ...newConversations[conversationIndex],
          isOpened: true
        }

        return newConversations
      })
      return
    }
    setConversationsOpened((prev) => [
      ...prev,
      {
        userId: id,
        name,
        profilePicture,
        activity_status,
        role,
        isOpened: true,
        newMessage: false,
        status,
        messageIdToScroll: messageIdToScroll
      }
    ])
  }

  const removeConversation = (id: string) => {
    setConversationsOpened((prev) => prev.filter((conversation) => conversation.userId !== id))
  }

  const switchConversationState = (id: string) => {
    setConversationsOpened((prev) => {
      const conversationIndex = prev.findIndex((conversation) => conversation.userId === id)
      if (conversationIndex < 0) return [...prev]
      const newConversations = [...prev]
      newConversations[conversationIndex] = {
        ...newConversations[conversationIndex],
        isOpened: !newConversations[conversationIndex].isOpened
      }
      return newConversations
    })
  }

  const getConversationState = (id: string): boolean => {
    const conversation = conversationsOpened.find((conversation) => conversation.userId === id)
    return conversation ? conversation.isOpened : false
  }

  const newMessageUpdateConversation = (id: string) => {
    setConversationsOpened((prev) => {
      const conversationIndex = prev.findIndex((conversation) => conversation.userId === id)
      if (conversationIndex < 0) return [...prev]

      const newConversations = [...prev]
      newConversations[conversationIndex] = {
        ...newConversations[conversationIndex],
        newMessage: true
      }

      return newConversations
    })
  }

  const resetNewMessage = (id: string) => {
    setConversationsOpened((prev) => {
      const conversationIndex = prev.findIndex((conversation) => conversation.userId === id)
      if (conversationIndex < 0) return [...prev]

      const newConversations = [...prev]
      newConversations[conversationIndex] = {
        ...newConversations[conversationIndex],
        newMessage: false
      }

      return newConversations
    })
  }

  return (
    <ChatContext.Provider
      value={{
        setConversationsOpened,
        conversationsOpened,
        addConversation,
        removeConversation,
        switchConversationState,
        getConversationState,
        newMessageUpdateConversation,
        resetNewMessage,
        setUnreadStatus,
        unreadStatus,
        setConversations,
        conversations
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
