import { useAuth } from '@/hooks/useAuth'
import { useChat } from '@/hooks/useChat'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/ui/accordion'
import { formatDate } from '@/utils/date-formatter'
import { getProfilePictureSrc } from '@/utils/get-profile-picture-src'
import { MessageCircle } from 'lucide-react'
import React from 'react'

type addConversation = (
  id: string,
  name: string,
  profilePicture: string,
  role: string,
  status: 'online' | 'offline',
  activity_status: string,
  messageIdToScroll?: string | null
) => void

type Props = {
  searchResults: searchResultType
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type profile = {
  profileId: string
  profilePicture: string
  name: string
  messages: {
    createdAt: string
    message: string
    receiver: string
    sender: string
    name: string
    profilePicture: string
  }[]
}

export default function MessageSelection({ searchResults, setSearchOpen }: Props) {
  const { userGlobal } = useAuth()
  let totalProfiles: profile[] = []
  const addedProfiles = new Set()
  const {
    conversations,
    addConversation
  }: { conversations: TeamMember[]; addConversation: addConversation } = useChat()

  console.log("search result = ", searchResults)
  console.log("userGlobal = ", userGlobal._id)

  searchResults.messages.forEach((message) => {
    // Check if the sender is not the user and not already added
    if (message.sender && message.sender._id && message.sender._id !== userGlobal._id && !addedProfiles.has(message.sender._id)) {
      totalProfiles.push({
        profileId: message.sender._id,
        profilePicture: message.sender.profilePicture,
        name: message.sender.name,
        messages: []
      })
      addedProfiles.add(message.sender._id) // Mark sender as added
    }

    // Check if the receiver is not the user and not already added
    if (message.receiver &&message.receiver._id && message.receiver._id !== userGlobal._id && !addedProfiles.has(message.receiver._id)) {
      totalProfiles.push({
        profileId: message.receiver._id,
        profilePicture: message.receiver.profilePicture,
        name: message.receiver.name,
        messages: []
      })
      addedProfiles.add(message.receiver._id) // Mark receiver as added
    }
  })

  totalProfiles.map((profile) => {
    searchResults.messages.map((message) => {
      if ((message.sender && (message.sender._id === profile.profileId)) || (message.receiver && (message.receiver._id === profile.profileId))) {
        profile.messages.push({
          createdAt: message.createdAt,
          message: message.message,
          receiver: message.receiver._id,
          sender: message.sender._id,
          name: message.sender.name,
          profilePicture: message.sender.profilePicture
        })
      }
    })
  })

  const handleAddConversation = (profileId: string) => {
    const conversationExists = conversations.find((cnv) => cnv._id === profileId)
    if (conversationExists) {
      addConversation(
        conversationExists._id,
        conversationExists.name,
        conversationExists.profilePicture,
        conversationExists.role,
        conversationExists.status,
        conversationExists.activity_status
      )
      setSearchOpen(false)
    }
  }

  return (
    <React.Fragment>
      <p className="my-4 px-2 font-semibold text-muted-foreground dark:text-white/80">
        <MessageCircle className="mb-0.5 mr-0.5 inline-block h-5 w-5 dark:text-white/80" /> In Messages
      </p>
      <div className='px-1'>
      <div className="grid w-full grid-cols-1 gap-2 px-1 bg-black/5 border dark:border-neutral-700 dark:bg-neutral-800 rounded-sm">
        <Accordion type="single" collapsible className="w-full">
          {totalProfiles.map((profile) => (
            <AccordionItem value={profile.profileId} key={profile.profileId} className="px-2">
              <AccordionTrigger>
                <div className="flex flex-row items-center gap-2 px-3">
                  <img
                    className="h-10 w-10 rounded-xl"
                    src={getProfilePictureSrc(profile.profilePicture, profile.name)}
                  />
                  <div
                    onClick={() => handleAddConversation(profile.profileId)}
                    className="w-fit text-start"
                  >
                    <p className="cursor-pointer text-lg font-semibold capitalize">
                      {profile.name}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                {profile.messages.map((message) => (
                  <div className="mb-1 flex w-full flex-row items-center gap-2 px-3 last:mb-0">
                    <div className="flex w-full flex-row items-center gap-1">
                      <img
                        className="h-10 w-10 rounded-xl"
                        src={getProfilePictureSrc(message.profilePicture, message.name)}
                      />
                      <div className="group h-fit w-full text-start">
                        <p className="cursor-pointer pl-1 text-base capitalize group-hover:underline">
                          {message.name}
                        </p>
                        <div className="flex w-full flex-row justify-between">
                          <p className="cursor-pointer pl-2 text-xs text-muted-foreground group-hover:underline">
                            {(() => {
                              if (message.message.length > 30) {
                                return message.message.slice(0, 30) + '...'
                              }
                              return message.message
                            })()}
                          </p>
                          <small className="text-xs opacity-50">
                            {formatDate(message.createdAt)}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </div>
        </div>
    </React.Fragment>
  )
}
