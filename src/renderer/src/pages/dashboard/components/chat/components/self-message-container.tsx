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

export default function SelfMessageContainer({
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
  // handle image doesnt exist

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
      className={cn('flex items-start justify-end gap-3', {
        'mt-4': prevMessage
      })}
    >
      <div className="flex flex-row space-x-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <p className="text-nowrap px-2 tracking-tight">{timeAgo(message.timestamp).toString()}</p>
        </div>
        <div className="w-fit text-wrap rounded-2xl bg-black p-3 dark:bg-sky-900">
          <p className="text-base text-white">{message.message}</p>
          {message.fileUrl && message.fileUrl !== 'undefined' && message.fileUrl !== 'null' && (
            <Dialog>
              <DialogTrigger>
                <img src={message.fileUrl} alt="file" className="mt-1 h-40 w-auto object-cover" />
              </DialogTrigger>
              <DialogContent className="ring-none box-border flex items-center justify-center border-none bg-white outline-none dark:bg-zinc-800">
                <ContextMenu>
                  <ContextMenuTrigger>
                    <img
                      src={message.fileUrl}
                      alt="file"
                      className="h-full w-full object-contain py-2"
                    />
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
      </div>
      {prevMessage ? (
        <Avatar className="h-10 w-10">
          <AvatarImage src={profilePicture} className="object-cover" />
          <AvatarFallback>{userName.charAt(0) + userName.charAt(1)}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="mr-10" />
      )}
    </div>
  )
}
