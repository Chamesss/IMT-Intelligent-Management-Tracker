import Header from '@/components/header'
import Transition from '@/components/transition'
import { useAuth } from '@/hooks/useAuth'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { useChat } from '@/hooks/useChat'
import { useCompany } from '@/hooks/useCompany'
import useNetworkStatus from '@/hooks/useNetworkStatus'
import { useNotifications } from '@/hooks/useNotifications'
import { useSocket } from '@/hooks/useSocket'
import { handleError } from '@/middlewares/error-mapping'
import ConversationDialogue from '@/pages/dashboard/components/chat/components/conversation-dialogue'
import TeamMessages from '@/pages/dashboard/components/chat/team-messages'
import TimeTracking from '@/pages/dashboard/components/tracker/time-tracking'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Outlet, useLocation } from 'react-router-dom'

export default function UtilitiesLayout() {
  const {
    setUserGlobal,
    userGlobal,
    logout,
    logoutFromMain
  }: {
    setUserGlobal: React.Dispatch<React.SetStateAction<userState>>
    userGlobal: userState
    logout: () => void
    logoutFromMain: () => void
  } = useAuth()

  const {
    conversationsOpened
  }: {
    conversationsOpened: conversationOpened[]
  } = useChat()

  const [newMessage, setNewMessage] = useState<message>()
  const { setNotifications } = useNotifications()
  const { isOnline } = useNetworkStatus()
  const location = useLocation()
  const socket = useSocket()
  const api = useAxiosInterceptors()
  const { fetchCompany } = useCompany()
  let trigger = location.pathname
  if (location.pathname === '/task-kanban' || location.pathname === '/task-calendar') {
    trigger = 'false'
  }

  useEffect(() => {
    isOnline && userGlobal._id && fetchUserData()
  }, [isOnline])

  useEffect(() => {
    fetchUserData()
    fetchCompany(api)

    // logout on main logout
    window.api.onLogoutRenderer(() => {
      logoutFromMain()
    })

    window.api.onUpdateAccessTokenRenderer((accessToken: string) => {
      localStorage.setItem('accessToken', accessToken)
    })

    window.api.onSystemAwake(() => {
      socket.emit('joinRoom', {
        userId: userGlobal._id,
        companyId: userGlobal.companyId,
        status: 'online'
      })
    })

    window.api.onTrackingMode(async () => {
      try {
        await api.get('/api/tracker/tracker/start')
      } catch (e) {
        console.log(e)
      }
    })

    socket.on('userUpdate', (data: userState) => {
      setUserGlobal(data)
      localStorage.setItem('user', JSON.stringify(data))
    })

    //realtime notification handler
    socket.on(
      'receiveNotification',
      ({
        newNotification,
        windowsNotification
      }: {
        newNotification: notifications
        windowsNotification: {
          title: string
          body: string
        }
      }) => {
        setNotifications((prev: notifications[] | undefined) => [newNotification, ...(prev || [])])
        console.log('task notification === ', newNotification)
        // if (newNotification.type==='message' && newNotification.user?._id?.length > 0) {
        //   newMessageUpdateConversation(newNotification.user._id)
        // }
        toast(newNotification.message, {
          duration: 6000
        })
        window.api.sendNotification(windowsNotification.title, windowsNotification.body)
      }
    )

    // socket.on('meetingRequest', (data: meeting) => {
    //   window.api.sendNotification('New Meeting Scheduled', data.name)
    // })

    // socket.on('receiveMessage', (data: message) => {
    //   setNewMessage(data)
    //   setConversationsOpened((prevConversations) => {
    //     const isConversationOpened =
    //       prevConversations.find((conversation) => conversation.userId === data.sender)?.isOpened ||
    //       false

    //     if (!isConversationOpened) {
    //       setUnreadStatus((prev: unread[]) => {
    //         if (prev) {
    //           const index = prev.findIndex((unread: unread) => unread.senderId === data.sender)
    //           if (index < 0) {
    //             return [...prev, { senderId: data.sender, read: 1 }]
    //           } else {
    //             const newUnread = [...prev]
    //             newUnread[index] = { senderId: data.sender, read: prev[index].read + 1 }
    //             return newUnread
    //           }
    //         } else {
    //           return [{ senderId: data.sender, read: 1 }]
    //         }
    //       })
    //     }

    //     return prevConversations // Return unchanged conversations as this function is only to access the latest state
    //   })
    //   const senderName = conversations.find((conversation) => conversation._id === data.sender)?.name
    //   const capitalizedSenderName = senderName ? senderName.charAt(0).toUpperCase() + senderName.slice(1) : senderName;
    // })

    return () => {
      socket.off('userUpdate')
      socket.off('receivenotification')
      // socket.off('receiveMessage')
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/user/profile')

      response.status === 404 && logout()
      const userObject = {
        ...response.data.user,
        totalProjects: response.data.totalProjects,
        totalTasks: response.data.totalTasks
      }
      setUserGlobal(userObject)
      socket.emit('joinRoom', {
        userId: response.data.user._id,
        companyId: response.data.user.companyId,
        status: 'online'
      })
    } catch (e: unknown | AxiosError) {
      e instanceof AxiosError && e.response?.status === 404 && logout()
      handleError(e, logout)
      console.log(e)
    }
  }

  return (
    <div className="relative flex h-screen max-h-screen min-h-[43.75rem] min-w-[86rem] flex-col font-dm text-md font-medium">
      <Header />
      <div className="flex flex-1 bg-muted dark:bg-neutral-950">
        <div className="grid w-full grid-cols-5 gap-4 p-4">
          <Transition trigger={trigger} className="col-span-4 flex items-stretch">
            <Outlet />
          </Transition>
          <div className="col-span-1 flex flex-col gap-4">
            <TimeTracking />
            <TeamMessages />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 right-[20%] z-[9] h-[4rem] w-fit">
        <div className="absolute bottom-0 right-0">
          <div className="flex w-fit flex-row items-end justify-end gap-2">
            {conversationsOpened.length > 0 &&
              conversationsOpened.map((conversation: conversationOpened) => (
                <ConversationDialogue
                  key={conversation.userId}
                  conversation={conversation}
                  newMessage={newMessage}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
