import EmptyNotifications from '@/assets/misc/empty-notification'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import GeneralNotification from './component/general-notifications'
import MessageNotifications from './component/message-notifications'

export default function Notifications({
  notifications,
  unreadNotifications,
  postReadStatusNotifications
}: {
  notifications: notifications[] | undefined
  unreadNotifications: number
  postReadStatusNotifications: () => void
}) {
  const [activeTabs, setActiveTabs] = useState('General')
  const [open, setOpen] = useState(false)
  const generalNotifications =
    notifications?.filter((notification) =>
      ['general', 'event', 'work', 'comment'].includes(notification.type)
    ) || []
  const messageNotifications =
    notifications?.filter((notification) => notification.type === 'message') || []

  useEffect(() => {
    setActiveTabs('General')
  }, [open])

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) postReadStatusNotifications()
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="relative">
        <Bell className="h-[1.4rem] w-[1.4rem] cursor-pointer text-lightGray transition-all hover:scale-105 hover:brightness-105 active:scale-90" />
        {unreadNotifications > 0 && (
          <div className="absolute right-[-20%] top-[-40%] h-4 w-4 rounded-full bg-red-500 text-white">
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-[0.75rem]">
              {unreadNotifications}
            </p>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[20rem] dark:border-darkGray dark:bg-neutral-900"
      >
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between px-3 pb-2 pt-4">
            <h1 className="font-dm text-base font-semibold">Notifications</h1>
            <h1
              onClick={postReadStatusNotifications}
              className="cursor-pointer font-dm text-[0.85rem] text-neutral-400 hover:underline hover:opacity-70"
            >
              Mark all as read
            </h1>
          </div>
          <Tabs defaultValue="General" onValueChange={setActiveTabs} className="space-y-0">
            <TabsList className="relative flex w-full justify-start rounded-none !bg-transparent !px-2">
              <TabsTrigger className="!p-0 !shadow-none dark:bg-neutral-900" value="General">
                General
              </TabsTrigger>
              <div className="mx-2 h-[70%] w-[0.1rem] bg-custom" />
              <TabsTrigger
                defaultChecked={true}
                className="!p-0 !shadow-none dark:bg-neutral-900"
                value="Messages"
              >
                Inbox
              </TabsTrigger>
              <div
                className={cn(
                  'absolute bottom-0 left-[0.1rem] h-[0.15rem] w-[4rem] rounded-full bg-black transition-all ease-out dark:bg-white',
                  {
                    'w-[3.5rem] translate-x-[3.8rem]': activeTabs === 'Messages',
                    'w-[4rem] translate-x-[0rem]': activeTabs === 'General',
                    'opacity-0 duration-0': open === false
                  }
                )}
              />
            </TabsList>
            <TabsContent value="General" className="scrollbar max-h-[20rem] overflow-y-auto py-2">
              {generalNotifications.length === 0 ? (
                <EmptyNotificationsContainer />
              ) : (
                generalNotifications.map((notification, i) => (
                  <GeneralNotification
                    key={i}
                    notification={notification}
                    handleOpenChange={handleOpenChange}
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="Messages" className="scrollbar max-h-[20rem] overflow-y-auto py-2">
              {messageNotifications.length === 0 ? (
                <EmptyNotificationsContainer />
              ) : (
                messageNotifications.map((notification, i) => (
                  <MessageNotifications
                    key={i}
                    notification={notification}
                    handleOpenChange={handleOpenChange}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const EmptyNotificationsContainer = () => (
  <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 py-4">
    <EmptyNotifications />
    <p className="text-lg font-semibold">Yay!</p>
    <p className="text-sm opacity-70">No notifications at the moment</p>
  </div>
)
