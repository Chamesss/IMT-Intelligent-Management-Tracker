import Spinner from '@/components/spinner'
import UserStatus from '@/components/user-status.js'
import { unread } from '@/contexts/chat-provider'
import { useAuth } from '@/hooks/useAuth.js'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { useChat } from '@/hooks/useChat'
import { useSocket } from '@/hooks/useSocket'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Card, CardContent, CardHeader } from '@/ui/card'
import { Input } from '@/ui/input'
import { Paperclip, Send, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import OtherMessageContainer from './other-message-container'
import SelfMessageContainer from './self-message-container'

export default function ConversationDialogue({
  conversation,
  newMessage
}: {
  conversation: conversationOpened
  newMessage: message | undefined
}) {
  const {
    removeConversation,
    switchConversationState,
    getConversationState,
    resetNewMessage,
    setUnreadStatus
  } = useChat()
  const { userGlobal } = useAuth()
  const [messages, setMessages] = useState<message[] | undefined>()
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [page, setPage] = useState(1)
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const api = useAxiosInterceptors()
  const firstFetchRef = useRef(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollHeightRef = useRef()
  const [end, setEnd] = useState(false)
  const [loading, setLoading] = useState(false)
  const socket = useSocket()

  useEffect(() => {
    if (messageContainerRef.current && page === 2) {
      messageContainerRef.current?.scrollIntoView({ behavior: 'auto' })
    }
    if (getConversationState(conversation.userId))
      setUnreadStatus((prev: unread[]) => {
        if (prev) {
          const index = prev.findIndex((unread: unread) => unread.senderId === conversation.userId)
          if (index >= 0) {
            prev[index].read = 0
            return [...prev]
          }
          return [...prev]
        }
        return prev
      })
  }, [messages, getConversationState(conversation.userId)])

  useEffect(() => {
    if (firstFetchRef.current) {
      firstFetchRef.current = false
      getMessages()
    }
  }, [])

  useEffect(() => {
    conversation.userId === newMessage?.sender &&
      setMessages((prev) => [...(prev || []), newMessage])
  }, [newMessage])

  useEffect(() => {
    socket.on('receiveMessage', (data: message) => {
      if (
        data.sender === conversation.userId ||
        (data.sender === userGlobal._id && data.receiver === conversation.userId)
      )
        setMessages((prev) => [...(prev || []), data])
    })

    return () => {
      socket.off('receiveMessage')
    }
  }, [])

  async function getMessages() {
    try {
      const scrollHeight = containerRef.current?.scrollHeight
      //@ts-ignore
      scrollHeightRef.current = scrollHeight
      const response = await api.get(`/api/chat/messages/`, {
        params: {
          receiverId: conversation.userId,
          senderId: userGlobal._id,
          page: page
        }
      })

      setMessages((prev) => [...response.data.messages, ...(prev || [])])
      if (response.data.messages.length < 20) {
        setEnd(true)
      }
      setPage((prev) => prev + 1)
    } catch (error) {
      console.log(error)
      //handleError(error, logout)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      const newScrollHeight = containerRef.current.scrollHeight
      if (scrollHeightRef.current !== undefined && newScrollHeight > scrollHeightRef.current) {
        containerRef.current.scrollTop = newScrollHeight - scrollHeightRef.current
      }
    }
  }, [messages])

  async function handleSubmitMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    if (message.length > 0 || (files && files[0])) {
      try {
        const formData = new FormData()
        files && formData.append('file', files[0])
        formData.append('receiver', conversation.userId)
        formData.append('message', message)
        setMessage('')
        setFiles(null)
        const response = await api.post('/api/chat/messages', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (response.status !== 201) {
          window.api.sendNotification('Failed to send message', 'Please try again later')
        }
      } catch (error) {
        window.api.sendNotification('Failed to send message', 'Please try again later')
        console.log(error)
        //handleError(e, logout)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div
      className={cn('w-[16rem] translate-y-1', {
        'w-[25rem]': getConversationState(conversation.userId)
      })}
    >
      <Card className="dark:border-neutral-700">
        <CardHeader
          onClick={() => {
            resetNewMessage(conversation.userId)
            switchConversationState(conversation.userId)
          }}
          className={cn(
            'flex cursor-pointer flex-row items-center justify-between rounded-t-lg border-b bg-primary bg-white px-4 py-[0.25rem] hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800',
            { 'py-[0.5rem]': getConversationState(conversation.userId) }
          )}
        >
          <div className="flex flex-row items-center gap-[0.75rem] py-[0.25rem]">
            <Avatar className="relative h-8 w-8 !rounded-lg">
              <AvatarImage
                className="!rounded-none object-cover"
                src={conversation.profilePicture}
              />
              <AvatarFallback>
                {conversation.name.charAt(0) + conversation.name.charAt(1)}
              </AvatarFallback>
              <div className="translate-x-0.5 translate-y-0.5 scale-[0.85]">
                <UserStatus status={conversation.status} />
              </div>
            </Avatar>
            <div className="flex flex-col">
              <div className="relative">
                <h2
                  className={cn('text-[0.95rem] capitalize', {
                    'font-semibold': conversation.newMessage
                  })}
                >
                  {conversation.name}
                  {conversation.newMessage && (
                    <div className="ml-1 inline-block h-3 w-3 rounded-full bg-red-500" />
                  )}
                </h2>
              </div>
              <small className="text-nowrap text-[12px] font-medium capitalize text-lightGray">
                {conversation.role}{' '}
                {conversation.activity_status &&
                  conversation.activity_status.toLowerCase() === 'in tracking' && (
                    <small className="ml-1 text-xs text-blue-700"> in tracking</small>
                  )}
              </small>
            </div>
          </div>
          <div
            onClick={() => {
              removeConversation(conversation.userId)
            }}
          >
            <X className="z-[10] cursor-pointer transition-all hover:text-gray-600" />
          </div>
        </CardHeader>
        {getConversationState(conversation.userId) && (
          <React.Fragment>
            <CardContent
              ref={containerRef}
              className="h-[400px] overflow-y-auto py-4 pb-4 pt-1 dark:bg-zinc-950"
            >
              <div className="w-full space-y-1">
                {end === false && (
                  <div
                    onClick={getMessages}
                    className="cursor-pointer py-1 text-center text-xs opacity-80 hover:underline hover:opacity-65"
                  >
                    Load more
                  </div>
                )}
                {messages &&
                  messages.map((message: message, i) => (
                    <div ref={messageContainerRef} key={i}>
                      {message.sender === userGlobal._id ? (
                        <SelfMessageContainer
                          message={message}
                          prevMessage={i > 0 && messages[i - 1].sender !== messages[i].sender}
                          profilePicture={userGlobal.profilePicture}
                          userName={userGlobal.name}
                        />
                      ) : (
                        <OtherMessageContainer
                          message={message}
                          prevMessage={i > 0 && messages[i - 1].sender !== messages[i].sender}
                          profilePicture={conversation.profilePicture}
                          userName={conversation.name}
                        />
                      )}
                    </div>
                  ))}
                <div ref={messageContainerRef} />
              </div>
            </CardContent>
            <div className="flex items-center justify-center border-t border-custom px-4 py-2 dark:border-t-neutral-700 dark:bg-neutral-800">
              <form className="flex w-full items-center gap-2" onSubmit={handleSubmitMessage}>
                <div className="!-pb-2 group relative inline-block h-fit cursor-pointer p-2">
                  <label className="my-auto inline-flex cursor-pointer items-center transition-all active:scale-90 group-hover:opacity-50">
                    <Paperclip className="z-[20] h-6 w-6" />
                    <Input
                      type="file"
                      accept=".pdf, .docx, .doc, .odt, .jpg, .jpeg, .png, .gif, .webp"
                      className="left-s1/2 absolute top-1/2 z-[10] h-full w-full -translate-x-1/2 -translate-y-1/2 transform cursor-pointer opacity-0 group-hover:cursor-pointer"
                      onChange={(e) => setFiles(e.currentTarget.files)}
                    />
                    {files && (
                      <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-red-500" />
                    )}
                  </label>
                </div>
                <div className="group flex w-full flex-row items-center justify-between rounded-2xl border border-custom px-3 py-1 dark:border-2 dark:border-white/20 dark:focus-within:border-2 dark:focus-within:!border-white">
                  <input
                    placeholder="Type your message..."
                    name="message"
                    className="flex-1 px-1 py-2 text-sm focus:outline-none dark:bg-transparent"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                  />
                  {loading === false ? (
                    <button className="cursor-pointer" type="submit">
                      <Send className="transition-all hover:rotate-45 active:scale-90" />
                    </button>
                  ) : (
                    <Spinner className="h-5 w-5 !border-black !border-b-transparent dark:!border-white dark:!border-b-transparent" />
                  )}
                </div>
              </form>
            </div>
          </React.Fragment>
        )}
      </Card>
    </div>
  )
}
