import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/ui/context-menu'
import { Dialog, DialogContent, DialogTrigger } from '@/ui/dialog'
import { Skeleton } from '@/ui/skeleton'
import React, { useState } from 'react'

type Props = {
  file: {
    file: string
    fileType: string
    fileName: string
  }
}

export default function PhotoLoader({ file }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const handleDownload = async (fileUrl: string) => {
    await window.api.downloadFile({
      url: fileUrl,
      properties: {
        directory: 'Pictures/tracker'
      }
    })
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <Dialog>
      <DialogTrigger>
        <React.Fragment>
          {!imageLoaded && <Skeleton className="h-[10rem] w-[16rem]" />}
          <img
            src={file.file}
            alt="profile"
            className={`h-[10rem] w-auto cursor-pointer rounded-lg ${imageLoaded ? '' : 'hidden'}`}
            loading="eager"
            onLoad={handleImageLoad}
          />
        </React.Fragment>
      </DialogTrigger>
      <DialogContent className="h-auto w-full p-1">
        <ContextMenu>
          <ContextMenuTrigger>
            <img
              src={file.file}
              alt="profile"
              className="h-auto w-full cursor-pointer rounded-lg"
            />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => handleDownload(file.file)}>Download</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </DialogContent>
    </Dialog>
  )
}
