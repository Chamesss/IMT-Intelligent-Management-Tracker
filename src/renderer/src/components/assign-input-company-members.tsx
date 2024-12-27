import { useAuth } from '@/hooks/useAuth'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import useFixScrollForModaledPopovers from '@/hooks/useScrollFix'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { ChevronDown, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AssignInputCompanyMembers({
  members,
  setMembers,
  selectedMembers,
  setSelectedMembers,
  fixScroll = false
}: {
  members: User[]
  setMembers: React.Dispatch<React.SetStateAction<User[]>>
  selectedMembers: string[]
  setSelectedMembers: React.Dispatch<React.SetStateAction<string[]>>
  fixScroll?: boolean
}) {
  const [membersToDisplay, setMembersToDisplay] = useState<User[]>(members)
  const [open, setOpen] = useState(false)
  const api = useAxiosInterceptors()
  const { userGlobal } = useAuth()
  const { onScroll, onTouchStart, onTouchMove } = useFixScrollForModaledPopovers()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`/api/company/users1/${userGlobal.companyId}`)
        setMembers(response.data.users)
        selectedMembers.length > 0
          ? setMembersToDisplay(() =>
              response.data.users.filter((member: User) => !selectedMembers.includes(member._id))
            )
          : setMembersToDisplay(response.data.users)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUsers()
  }, [])

  const handleSelectUser = (user: User) => {
    setMembersToDisplay((prev) => prev.filter((member) => member._id !== user._id))
    setSelectedMembers((prev) => [...prev, user._id])
  }

  const handleDeleteUser = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation()
    setSelectedMembers((prev) => prev.filter((member) => member !== userId))
    const user = members.find((member) => member._id === userId)
    if (user) {
      setMembersToDisplay((prev) => [...prev, user])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Members</Label>
      <Popover modal={fixScroll} open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-full" asChild>
          <Button
            variant="outline"
            className={`flex h-[3.2rem] flex-grow-0 justify-between px-3 font-normal text-muted-foreground`}
          >
            {selectedMembers?.length ? (
              <div className="flex flex-grow-0 flex-row items-center justify-start gap-2 overflow-x-scroll py-1">
                {selectedMembers.map((selectedMember) => {
                  const member = members.find((user) => user._id === selectedMember)
                  if (!member) return null
                  return (
                    <Badge
                      key={member._id}
                      className="flex flex-row items-center gap-2 bg-slate-800/90 hover:bg-slate-800/100"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage className="object-cover" src={member.profilePicture} />
                        <AvatarFallback> {member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm capitalize">{member.name}</span>
                      <X
                        onClick={(e) => handleDeleteUser(e, member._id)}
                        className="mb-[0.05rem] ml-1 inline-block h-4 w-4 cursor-pointer text-red-400 hover:text-red-500"
                      />
                    </Badge>
                  )
                })}
              </div>
            ) : (
              'Assign Members'
            )}
            <ChevronDown
              className={cn(
                'ml-2 h-6 w-6 shrink-0 rounded-full bg-black/25 text-white transition-all hover:bg-black/20',
                {
                  'rotate-180': open
                }
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="flex max-h-[10rem] flex-col overflow-y-auto p-2"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onWheel={onScroll}
          align="end"
        >
          {membersToDisplay &&
            membersToDisplay.length > 0 &&
            membersToDisplay.map((member) => (
              <div className="cursor-pointer p-2 transition-all hover:bg-gray-200" key={member._id}>
                <div
                  className="flex flex-row items-center gap-2"
                  onClick={() => handleSelectUser(member)}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage className="object-cover" src={member.profilePicture} />
                    <AvatarFallback> {member.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm capitalize">{member.name}</span>
                </div>
              </div>
            ))}
          {membersToDisplay.length === 0 && (
            <h6 className="w-full text-center text-sm font-thin italic text-gray-500">
              No members available
            </h6>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
