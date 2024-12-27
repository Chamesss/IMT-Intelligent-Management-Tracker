import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/ui/context-menu'
import { Dialog, DialogContent, DialogTrigger } from '@/ui/dialog'
import { timeAgo } from '@/utils/time-ago'

export default function OtherMessageContainer({
  message,
  prevMessage,
  profilePicture,
  userName
}: {
  message: message
  prevMessage: boolean
  profilePicture: string
  userName: string
}) {
  const handleDownload = async (fileUrl: string) => {
    await window.api.downloadFile({
      url: fileUrl,
      properties: {
        directory: 'Pictures/tracker'
      }
    })
  }

  return (
    <div
      className={cn('flex items-start justify-start gap-3', {
        '!mt-4': prevMessage
      })}
    >
      {prevMessage ? (
        <Avatar className="h-10 w-10">
          <AvatarImage src={profilePicture} className='object-cover' />
          <AvatarFallback>{userName.charAt(0) + userName.charAt(1)}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="ml-10" />
      )}
      <div className="flex flex-row space-y-1">
        <div className="w-fit text-wrap rounded-2xl bg-neutral-100 p-3 dark:bg-white/20">
          <p className="text-base">{message.message}</p>
          {message.fileUrl && message.fileUrl !== 'undefined' && message.fileUrl !== 'null' && (
            <Dialog>
              <DialogTrigger>
                <img src={message.fileUrl} alt="file" className="h-40 w-40" />
              </DialogTrigger>
              <DialogContent>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div className="h-full max-h-[80vh] w-full max-w-[80vw]">
                      <img
                        src={message.fileUrl}
                        alt="file"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => handleDownload(message.fileUrl)}>
                      Download
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <p className="text-nowrap px-2 tracking-tight">{timeAgo(message.timestamp).toString()}</p>
        </div>
      </div>
    </div>
  )
}
