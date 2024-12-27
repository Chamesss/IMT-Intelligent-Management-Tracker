import calendar from '@/assets/dashboard/Calendar.svg'
import profile from '@/assets/dashboard/profile.svg'
import { useAuth } from '@/hooks/useAuth'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { useCompany } from '@/hooks/useCompany'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import Notifications from '@/pages/dashboard/dashboard/components/notifications-container/notifications'
import SearchModal from '@/pages/dashboard/dashboard/components/search-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from '@/ui/dialog'
import { DropdownMenu, DropdownMenuTrigger } from '@/ui/dropdown-menu'
import { CircleGauge, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SettingsProfile from './settings'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const api = useAxiosInterceptors()

  const { userGlobal }: { userGlobal: userState; logout: () => void } = useAuth()
  const {
    notifications,
    setNotifications
  }: {
    notifications: notifications[] | undefined
    setNotifications: React.Dispatch<React.SetStateAction<notifications[] | undefined>>
  } = useNotifications()
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0)
  const [searchOpen, setSearchOpen] = useState<boolean>(false)
  const { company } = useCompany()

  async function fetchNotification() {
    try {
      const response = await api.get('/api/notification/notifications')
      setNotifications(response.data.notifications)
    } catch (error) {
      console.log(error)
    }
  }

  async function postReadStatusNotifications() {
    try {
      const response = await api.post('/api/notification/notifications/read')
      if (response.status === 200) {
        setNotifications(
          (prev: notifications[] | undefined) =>
            prev?.map((notification) => {
              notification.read = true
              return notification
            }) || []
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchNotification()
  }, [])

  useEffect(() => {
    let unreadNotifications = 0
    for (const notification of notifications || []) {
      if (!notification.read) {
        unreadNotifications++
      }
    }
    setUnreadNotifications(unreadNotifications)
  }, [notifications])

  return (
    <header
      id="header"
      className="relative flex !h-[3.8rem] flex-row items-center justify-between border-b-[0.1rem] border-custom shadow-sm dark:border-black dark:bg-neutral-800"
    >
      <div className="mx-4 flex h-full items-center gap-3 text-mediumGray">
        {company && company.logo && <img src={company.logo} alt="icon" className="h-8 w-8" />}
        <span
          onClick={() => navigate('/dashboard')}
          className={cn('relative flex h-full cursor-pointer items-center gap-1 px-2', {
            'text-black dark:text-white':
              location.pathname === '/dashboard' ||
              location.pathname === '/task-kanban' ||
              location.pathname === '/task-calendar',
            'text-mediumGray':
              location.pathname !== '/dashboard' &&
              location.pathname !== '/task-kanban' &&
              location.pathname !== '/task-calendar'
          })}
        >
          <CircleGauge className="h-5.5 w-5.5 mr-1 text-mediumGray" />
          <p className="text-base">Dashboard</p>
          {(location.pathname === '/dashboard' ||
            location.pathname === '/task-kanban' ||
            location.pathname === '/task-calendar') && (
            <div className="absolute bottom-0 left-1/2 h-[4px] w-full -translate-x-1/2 transform rounded-full bg-black dark:bg-white" />
          )}
        </span>
        <span
          onClick={() => navigate('/calendar')}
          className={cn('relative flex h-full cursor-pointer items-center gap-1 px-2', {
            'text-black dark:text-white': location.pathname === '/calendar',
            'text-mediumGray': location.pathname !== '/calendar'
          })}
        >
          <img src={calendar} alt="calendar" className="mr-1" />{' '}
          <p className="text-base">Calendar</p>
          {location.pathname === '/calendar' && (
            <div className="absolute bottom-0 left-1/2 h-[4px] w-full -translate-x-1/2 transform rounded-full bg-black dark:bg-white" />
          )}
        </span>
        <span
          onClick={() => navigate('/profile')}
          className={cn('relative flex h-full cursor-pointer items-center gap-1 px-2', {
            'text-black dark:text-white': location.pathname === '/profile',
            'text-mediumGray': location.pathname !== '/profile'
          })}
        >
          <img src={profile} alt="profile" className="mr-1" /> <p className="text-base">Profile</p>
          {location.pathname === '/profile' && (
            <div className="absolute bottom-0 left-1/2 h-[4px] w-full -translate-x-1/2 transform rounded-full bg-black dark:bg-white" />
          )}
        </span>
      </div>
      <div className="mr-6 flex flex-row items-center justify-center gap-3">
        <div className="mt-2 flex flex-row justify-center gap-3">
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger>
              <Search className="mb-0.5 h-[1.4rem] w-[1.4rem] cursor-pointer text-lightGray transition-all hover:scale-105 hover:brightness-105 active:scale-90" />
            </DialogTrigger>
            <DialogContent className="box-content min-w-[40rem] overflow-hidden !rounded-xl border-none bg-transparent p-0 dark:bg-transparent">
              <SearchModal setSearchOpen={setSearchOpen} />
            </DialogContent>
          </Dialog>
          <Notifications
            notifications={notifications}
            unreadNotifications={unreadNotifications}
            postReadStatusNotifications={postReadStatusNotifications}
          />
        </div>
        <div className="mx-1" />
        <DropdownMenu>
          <DropdownMenuTrigger className="mr-2 flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage
                src={userGlobal.profilePicture}
                className="h-[2.563rem] w-[2.563rem] cursor-pointer object-cover hover:brightness-105"
              />
              <AvatarFallback>{userGlobal.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <div className="text-sm capitalize">{userGlobal.name}</div>
              <div className="text-xs capitalize text-lightGray">{userGlobal.profession}</div>
            </div>
          </DropdownMenuTrigger>
          <SettingsProfile name={userGlobal.name} />
        </DropdownMenu>
      </div>
    </header>
  )
}
