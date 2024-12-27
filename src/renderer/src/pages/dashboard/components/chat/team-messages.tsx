import Spinner from '@/components/spinner'
import SpinnerBlack from '@/components/spinner-black'
import { unread } from '@/contexts/chat-provider'
import { useAuth } from '@/hooks/useAuth'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { useChat } from '@/hooks/useChat'
import useNetworkStatus from '@/hooks/useNetworkStatus'
import { useSocket } from '@/hooks/useSocket'
import { cn } from '@/lib/utils'
import retryRequest from '@/utils/retry-call'
import { sortTeamMembers } from '@/utils/sort-team-members'
import { AxiosError } from 'axios'
import { MessageCircle, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNetworkState } from 'react-use'
import ConversationCell from './components/conversation-cell'

export default function TeamMessages() {
  const [conversationsFiltered, setConversationsFiltered] = useState<TeamMember[] | undefined>()
  const {
    addConversation,
    setConversationsOpened,
    setUnreadStatus,
    setConversations,
    conversations
  } = useChat()
  const { userGlobal } = useAuth()
  const [messageSearch, setMessageSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()
  const isOnline = useNetworkState()
  const api = useAxiosInterceptors()
  const socket = useSocket()

  // company id = 66b0bf0bd912cefb5f7ee1b8

  useEffect(() => {
    //console.log(userGlobal._id)
    //console.log(localStorage.getItem('accessToken'))
    //@eslint-disable-next-line
    if (isOnline.online) {
      fetchTeamMembers()
    } else {
      if (conversations && conversations.length > 0) {
        setConversations((prevConversations) => {
          const newConversations = prevConversations?.map((conversation) => {
            conversation.status = 'offline'
            conversation.activity_status = 'out'
            return conversation
          })
          const sortedTeamMembers = sortTeamMembers(newConversations || [])
          return sortedTeamMembers
        })
        setConversationsFiltered((prevConversations) => {
          const newConversations = prevConversations?.map((conversation) => {
            conversation.status = 'offline'
            conversation.activity_status = 'out'
            return conversation
          })
          const sortedTeamMembers = sortTeamMembers(newConversations || [])
          return sortedTeamMembers
        })
      } else {
        setError('No Internet Connection')
        setLoading(false)
      }
    }
  }, [isOnline])

  async function fetchTeamMembers() {
    try {
      const response = await retryRequest(
        () => api.get(`/api/company/users/${userGlobal.companyId}`),
        3,
        1000
      )
      const sortedTeamMembers = sortTeamMembers(response.data.users)
      setUnreadStatus(
        response.data.users.map((user: TeamMember) => ({
          senderId: user._id,
          read: user.unreadMessages
        }))
      )
      setConversations(sortedTeamMembers)
      setConversationsFiltered(sortedTeamMembers)
    } catch (error: unknown | AxiosError) {
      // handleError(error, logout)
      if (error instanceof AxiosError) {
        setError(error.response?.data.error)
      } else {
        setError('An error occurred' + JSON.stringify(error))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    socket.on('statusChange', (data: { userId: string; status: 'online' | 'offline' }) => {
      setConversations((prevConversations) => {
        const newConversations = prevConversations?.map((conversation) => {
          if (conversation._id === data.userId) {
            return { ...conversation, status: data.status }
          }
          return conversation
        })
        const sortedTeamMembers = sortTeamMembers(newConversations || [])
        return sortedTeamMembers
      })
      setConversationsFiltered((prevConversations) => {
        const newConversations = prevConversations?.map((conversation) => {
          if (conversation._id === data.userId) {
            return { ...conversation, status: data.status }
          }
          return conversation
        })
        const sortedTeamMembers = sortTeamMembers(newConversations || [])
        return sortedTeamMembers
      })
      setConversationsOpened((prevConversationsOpened: conversationOpened[] | []) => {
        const newConversations = prevConversationsOpened?.map(
          (conversation: conversationOpened) => {
            if (conversation.userId === data.userId) {
              return { ...conversation, status: data.status }
            }
            return conversation
          }
        )
        return newConversations
      })
    })

    socket.on('inTracking', (data: { userId: string; activity_status: string }) => {
      setConversations((prevConversations) => {
        const newConversations = prevConversations?.map((conversation) => {
          if (conversation._id === data.userId) {
            return { ...conversation, activity_status: 'in tracking' }
          }
          return conversation
        })
        const sortedTeamMembers = sortTeamMembers(newConversations || [])
        return sortedTeamMembers
      })
      setConversationsFiltered((prevConversations) => {
        const newConversations = prevConversations?.map((conversation) => {
          if (conversation._id === data.userId) {
            return { ...conversation, activity_status: 'in tracking' }
          }
          return conversation
        })
        const sortedTeamMembers = sortTeamMembers(newConversations || [])
        return sortedTeamMembers
      })
      setConversationsOpened((prevConversationsOpened: conversationOpened[] | []) => {
        const newConversations = prevConversationsOpened?.map(
          (conversation: conversationOpened) => {
            if (conversation.userId === data.userId) {
              return { ...conversation, activity_status: 'in tracking' }
            }
            return conversation
          }
        )
        return newConversations
      })
    })

    socket.on('outTracking', (data) => {
      setConversations((prevConversations) => {
        const newConversations = prevConversations?.map((conversation) => {
          if (conversation._id === data.userId) {
            return { ...conversation, activity_status: 'none' }
          }
          return conversation
        })
        const sortedTeamMembers = sortTeamMembers(newConversations || [])
        return sortedTeamMembers
      })
      setConversationsFiltered((prevConversations) => {
        const newConversations = prevConversations?.map((conversation) => {
          if (conversation._id === data.userId) {
            return { ...conversation, activity_status: 'none' }
          }
          return conversation
        })
        const sortedTeamMembers = sortTeamMembers(newConversations || [])
        return sortedTeamMembers
      })
      setConversationsOpened((prevConversationsOpened: conversationOpened[] | []) => {
        const newConversations = prevConversationsOpened?.map(
          (conversation: conversationOpened) => {
            if (conversation.userId === data.userId) {
              return { ...conversation, activity_status: 'none' }
            }
            return conversation
          }
        )
        return newConversations
      })
    })

    return () => {
      socket.off('statusChange')
      socket.off('inTracking')
      socket.off('outTracking')
    }
  }, [])

  useEffect(() => {
    ;(() => {
      if (messageSearch.length > 0) {
        const filteredConversations = conversations?.filter((conversation) =>
          conversation.name.toLowerCase().includes(messageSearch.toLowerCase())
        )
        setConversationsFiltered(filteredConversations)
      } else {
        setConversationsFiltered(conversations)
      }
    })()
  }, [messageSearch])

  const markReadStatus = (conversationId: string) => {
    setUnreadStatus((prev: unread[]) => {
      if (prev) {
        const index = prev.findIndex((unread) => unread.senderId === conversationId)
        if (index < 0) {
          return prev
        }
        const newUnread = [...prev]
        newUnread[index] = { senderId: conversationId, read: 0 }
        return newUnread
      } else {
        return prev
      }
    })
    setConversations((prevConversations) => {
      const newConversations = prevConversations?.map((conversation) => {
        if (conversation._id === conversationId) {
          return { ...conversation, unreadMessages: 0 }
        }
        return conversation
      })
      const sortedTeamMembers = sortTeamMembers(newConversations || [])
      return sortedTeamMembers
    })
    setConversationsFiltered((prevConversations) => {
      const newConversations = prevConversations?.map((conversation) => {
        if (conversation._id === conversationId) {
          return { ...conversation, unreadMessages: 0 }
        }
        return conversation
      })
      const sortedTeamMembers = sortTeamMembers(newConversations || [])
      return sortedTeamMembers
    })
  }

  return (
    <div className="text-dm flex h-fit max-h-[30rem] min-h-[30rem] flex-col justify-start rounded-lg border-[0.12rem] border-custom bg-white dark:border-neutral-900 dark:bg-neutral-800">
      <div className="flex w-full flex-row items-center justify-between border-b border-custom p-4 font-dm text-base font-medium dark:border-black">
        <h1 className="flex flex-row items-center gap-2 text-base font-medium">
          <MessageCircle />
          Team Messages{' '}
          <span className="relative my-auto h-5 w-5 rounded-full bg-lightGray bg-opacity-20 text-[0.75rem] font-semibold">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {conversations?.length || 0}
            </span>
          </span>
        </h1>
      </div>
      <div className="px-2 py-4">
        <div className="flex h-[2.563rem] flex-row items-center gap-2 rounded-xl bg-searchInput px-4 dark:border-neutral-800 dark:bg-neutral-950">
          <Search className="h-[1rem] w-[1rem] cursor-pointer transition-all hover:scale-105 hover:brightness-125 active:scale-90" />
          <input
            className="h-full w-full bg-searchInput text-[0.75rem] focus:outline-none dark:bg-neutral-950"
            placeholder="Search in messages"
            onChange={(e) => setMessageSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="scrollbar flex flex-1 flex-col gap-2 overflow-auto p-2">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner className="h-5 w-5 !border-black !border-b-transparent dark:!border-white dark:!border-b-transparent" />
          </div>
        ) : (
          <>
            {error ? (
              <div className="flex h-full w-full items-center justify-center text-xs">{error}</div>
            ) : (
              <>
                {conversationsFiltered && conversationsFiltered.length > 0 ? (
                  <React.Fragment>
                    {conversationsFiltered.map((conversation, index) => {
                      return (
                        <React.Fragment key={index}>
                          <div
                            className={cn({ 'opacity-50': isOnline.online === false })}
                            onClick={() => {
                              addConversation(
                                conversation._id,
                                conversation.name,
                                conversation.profilePicture,
                                conversation.role,
                                conversation.status,
                                conversation.activity_status
                              )
                              markReadStatus(conversation._id)
                            }}
                          >
                            <ConversationCell conversation={conversation} />
                          </div>
                        </React.Fragment>
                      )
                    })}
                  </React.Fragment>
                ) : (
                  <div className="flex h-full flex-1 items-center justify-center text-center text-base">
                    No conversations found
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
